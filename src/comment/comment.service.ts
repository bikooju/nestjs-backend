import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Comment } from "./entity/comment.entity";
import { Repository } from "typeorm";
import { LikeService } from "src/like/like.service";
import { CreateCommentRequestDto } from "./dto/request/create-comment.request.dto";
import { CommentResponseDto } from "./dto/response/comment.response.dto";
import { UpdateCommentRequestDto } from "./dto/request/update-comment.request.dto";
import { UserRole } from "src/user/enums/user-role.enum";

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,
        private readonly likeService: LikeService,
    ) { }

    async create(postId: number, authorId: number, dto: CreateCommentRequestDto): Promise<CommentResponseDto> {
        const comment = this.commentRepository.create({
            ...dto,
            postId,
            authorId
        });

        const saved = await this.commentRepository.save(comment);

        return this.findOne(saved.id);
    }

    async findByPostId(postId: number, userId?: number): Promise<CommentResponseDto[]> {
        const comments = await this.commentRepository.find({
            where: { postId },
            relations: ['author'],
            order: { createdAt: 'DESC' }
        });

        // 구조: Promise.all( [ Promise, Promise, ... ] )
        // - map: comments의 각 댓글마다 toCommentResponseDto(comment)를 호출한다. 이 함수는 Promise를 반환하므로, map 결과는 "Promise 배열"이 된다.
        // - Promise.all: 그 Promise 배열을 받아서 전부 동시에 실행하고, 전부 끝나면 결과를 순서대로 담은 배열을 반환한다.
        const commentDtos = await Promise.all(
            comments.map((comment) => this.toCommentResponseDto(comment, userId))
        );
        return commentDtos;
    }

    async findOne(id: number, userId?: number): Promise<CommentResponseDto> {
        const comment = await this.commentRepository.findOne({
            where: { id },
            relations: ['author']
        });

        if (!comment) {
            throw new NotFoundException('댓글을 찾을 수 없습니다');
        }

        return this.toCommentResponseDto(comment, userId);
    }

    /**
     * 댓글 엔티티 하나를 응답 DTO로 변환한다.
     * likeCount, isLiked를 동시에 조회해서 대기 시간을 줄인다.
     */
    private async toCommentResponseDto(comment: Comment, userId?: number): Promise<CommentResponseDto> {
        // Promise.all: [좋아요 개수 조회, 내가 좋아요 했는지 조회] 두 요청을 동시에 보내고, 둘 다 끝날 때까지 한 번만 대기
        const [likeCount, isLiked] = await Promise.all([
            this.likeService.getCommentLikeCount(comment.id),
            userId ? this.likeService.isCommentLikedByUser(userId, comment.id) : false,
        ]);

        return new CommentResponseDto({ ...comment, likeCount, isLiked });
    }

    async update(
        id: number,
        userId: number,
        userRole: UserRole,
        dto: UpdateCommentRequestDto
    ): Promise<CommentResponseDto> {
        const comment = await this.commentRepository.findOne({ where: { id } });

        if (!comment) {
            throw new NotFoundException('댓글을 찾을 수 없습니다');
        }

        if (comment.authorId !== userId && userRole !== UserRole.ADMIN) {
            throw new ForbiddenException('댓글을 수정할 권한이 없습니다');
        }

        comment.content = dto.content;
        await this.commentRepository.save(comment);

        return this.findOne(id);
    }

    async delete(id: number, userId: number, userRole: UserRole): Promise<void> {
        const comment = await this.commentRepository.findOne({ where: { id } });

        if (!comment) {
            throw new NotFoundException('댓글을 찾을 수 없습니다');
        }

        if (comment.authorId !== userId && userRole !== UserRole.ADMIN) {
            throw new ForbiddenException('댓글을 삭제할 권한이 없습니다');
        }

        await this.commentRepository.softDelete(id);
    }
}