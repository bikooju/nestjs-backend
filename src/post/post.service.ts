import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Post } from "./entity/post.entity";
import { CategoryService } from "src/category/category.service";
import { LikeService } from "src/like/like.service";
import { GetPostsRequestDto } from "./dto/request/get-posts.request.dto";
import { PostListResponseDto } from "./dto/response/post-list.response.dto";
import { PostResponseDto } from "./dto/response/post.response.dto";
import { UserRole } from "src/user/enums/user-role.enum";
import { UpdatePostRequestDto } from "./dto/request/update-post.request.dto";
import { CreatePostRequestDto } from "./dto/request/create-post.request.dto";

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
        private readonly categoryService: CategoryService,
        private readonly likeService: LikeService,
    ) { }

    async create(authorId: number, dto: CreatePostRequestDto): Promise<PostResponseDto> {
        // 카테고리 존재 확인
        await this.categoryService.findOne(dto.categoryId);

        const post = this.postRepository.create({
            ...dto,
            authorId,
        })

        const saved = await this.postRepository.save(post);

        return this.findOne(saved.id);
    }

    async findAll(dto: GetPostsRequestDto, userId?: number): Promise<PostListResponseDto> {
        const { page = 1, limit = 10, categoryId, search } = dto;

        /**
         * SELECT post.*, author.*, category.*
         * FROM posts post
         * LEFT JOIN users author ON post.authorId = author.id
         * LEFT JOIN categories category ON post.categoryId = category.id
         * WHERE post.deletedAt IS NULL
         * AND post.categoryId = categoryId
         * AND (post.title LIKE '%검색어%' OR post.content LIKE '%검색어%')
         * ORDER BY post.createdAt DESC
         * LIMIT 10 OFFSET 0
         */

        const queryBuilder = this.postRepository
            .createQueryBuilder('post') // post는 별칭
            .leftJoinAndSelect('post.author', 'author') // author는 users의 별칭
            .leftJoinAndSelect('post.category', 'category') // category는 categories의 별칭
            .where('post.deletedAt IS NULL');

        // 카테고리 필터
        if (categoryId) {
            queryBuilder.andWhere('post.categoryId = :categoryId', { categoryId });
        }

        // 검색
        if (search) {
            queryBuilder.andWhere(
                '(post.title LIKE :search OR post.content LIKE :search)',
                { search: `%${search}%` }
            );
        }

        // 전체 개수
        /**
         * SELECT COUNT(*) FROM posts post
         * WHERE post.deletedAt IS NULL
         * AND post.categoryId = categoryId
         * AND (post.title LIKE '%검색어%' OR post.content LIKE '%검색어%')
         */
        const total = await queryBuilder.getCount();

        // 페이지네이션 적용 후 게시글 목록 조회
        const posts = await queryBuilder
            .orderBy('post.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit)
            .getMany();

        // 구조: Promise.all( [ Promise, Promise, ... ] )
        // - map: posts의 각 게시글마다 toPostResponseDto(post)를 호출한다. 이 함수는 Promise를 반환하므로, map 결과는 "Promise 배열"이 된다.
        // - Promise.all: 그 Promise 배열을 받아서 전부 동시에 실행하고, 전부 끝나면 결과를 순서대로 담은 배열을 반환한다.
        const postDtos = await Promise.all(
            posts.map((post) => this.toPostResponseDto(post, userId))
        );

        return {
            posts: postDtos,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        }
    }

    async findOne(id: number, userId?: number): Promise<PostResponseDto> {
        const post = await this.postRepository.findOne({
            where: { id },
            relations: ['author', 'category']
        })

        if (!post) {
            throw new NotFoundException('게시글을 찾을 수 없습니다');
        }

        return this.toPostResponseDto(post, userId);
    }

    /**
     * 게시글 엔티티 하나를 응답 DTO로 변환한다.
     * likeCount, isLiked를 동시에 조회해서 대기 시간을 줄인다.
     */
    private async toPostResponseDto(post: Post, userId?: number): Promise<PostResponseDto> {
        // Promise.all: [좋아요 개수 조회, 내가 좋아요 했는지 조회] 두 요청을 동시에 보내고, 둘 다 끝날 때까지 한 번만 대기
        const [likeCount, isLiked] = await Promise.all([
            this.likeService.getPostLikeCount(post.id),
            userId ? this.likeService.isPostLikedByUser(userId, post.id) : false,
        ]);

        return new PostResponseDto({ ...post, likeCount, isLiked });
    }

    /**
    * increment(
        조건,           // { id: 1 }
        증가할필드,      // 'viewCount'
        증가량          // 1
     )   
    * UPDATE posts 
    * SET viewCount = viewCount + 1 
    * WHERE id = 1
    */
    async incrementViewCount(id: number): Promise<void> {
        await this.postRepository.increment({ id }, 'viewCount', 1);
    }

    async update(
        id: number,
        userId: number,
        userRole: UserRole,
        dto: UpdatePostRequestDto
    ): Promise<PostResponseDto> {
        const post = await this.postRepository.findOne({ where: { id } });

        if (!post) {
            throw new NotFoundException('게시글을 찾을 수 없습니다');
        }

        // 권한 체크: 작성자 또는 관리자만
        if (post.authorId !== userId && userRole !== UserRole.ADMIN) {
            throw new ForbiddenException('게시글을 수정할 권한이 없습니다');
        }

        // 카테고리 변경 시 존재 확인
        if (dto.categoryId && dto.categoryId !== post.categoryId) {
            await this.categoryService.findOne(dto.categoryId);
        }

        // 선택적 업데이트
        if (dto.title !== undefined) {
            post.title = dto.title;
        }

        if (dto.content !== undefined) {
            post.content = dto.content;
        }

        if (dto.categoryId !== undefined) {
            post.categoryId = dto.categoryId;
        }

        await this.postRepository.save(post);

        return this.findOne(id);
    }

    async delete(id: number, userId: number, userRole: UserRole): Promise<void> {
        const post = await this.postRepository.findOne({ where: { id } });

        if (!post) {
            throw new NotFoundException('게시글을 찾을 수 없습니다');
        }

        // 권한 체크: 작성자 또는 관리자만
        if (post.authorId !== userId && userRole !== UserRole.ADMIN) {
            throw new ForbiddenException('게시글을 삭제할 권한이 없습니다');
        }

        await this.postRepository.softDelete(id);
    }

}