import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Post } from "./entity/post.entity";
import { CategoryService } from "src/category/category.service";
import { GetPostsRequestDto } from "./dto/request/get-posts.request.dto";
import { PostListResponseDto } from "./dto/response/post-list.response.dto";
import { PostResponseDto } from "./dto/response/post.response.dto";
import { UserRole } from "src/user/enums/user-role.enum";
import { UpdatePostRequestDto } from "./dto/request/update-post.request.dto";

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
        private readonly categoryService: CategoryService
    ) { }

    async findAll(dto: GetPostsRequestDto): Promise<PostListResponseDto> {
        const { page = 1, limit = 10, categoryId, search } = dto;

        const queryBuilder = this.postRepository
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.author', 'author')
            .leftJoinAndSelect('post.category', 'category')
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
        const total = await queryBuilder.getCount();

        // 페이지네이션
        const posts = await queryBuilder
            .orderBy('post.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit)
            .getMany();

        return {
            posts: posts.map((post) => new PostResponseDto(post)),
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        }
    }

    async findOne(id: number): Promise<PostResponseDto> {
        const post = await this.postRepository.findOne({
            where: { id },
            relations: ['author', 'category']
        })

        if (!post) {
            throw new NotFoundException('게시글을 찾을 수 없습니다');
        }

        return new PostResponseDto(post);
    }

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