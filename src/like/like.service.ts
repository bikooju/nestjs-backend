import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Like } from "./entity/like.entity";
import { Repository } from "typeorm";

@Injectable()
export class LikeService {
    constructor(
        @InjectRepository(Like)
        private readonly likeRepository: Repository<Like>
    ) { }

    async togglePostLike(userId: number, postId: number): Promise<{ liked: boolean }> {
        const existing = await this.likeRepository.findOne({
            where: { userId, postId }, // WHERE userId = ? AND postId = ?
        });

        if (existing) {
            // 이미 좋아요 -> 좋아요 취소
            await this.likeRepository.softDelete(existing.id);
            return { liked: false };
        } else {
            // 좋아요 추가
            const like = this.likeRepository.create({
                userId,
                postId,
                commentId: null
            });
            await this.likeRepository.save(like);
            return { liked: true };
        }
    }

    async toggleCommentLike(userId: number, commentId: number): Promise<{ liked: boolean }> {
        const existing = await this.likeRepository.findOne({
            where: { userId, commentId }
        });

        if (existing) {
            // 이미 좋아요 -> 좋아요 취소
            await this.likeRepository.softDelete(existing.id);
            return { liked: false };
        } else {
            // 좋아요 추가
            const like = this.likeRepository.create({
                userId,
                postId: null,
                commentId
            });
            await this.likeRepository.save(like);
            return { liked: true };
        }
    }

    async getPostLikeCount(postId: number): Promise<number> {
        return this.likeRepository.count({ where: { postId } });
    }

    async getCommentLikeCount(commentId: number): Promise<number> {
        return this.likeRepository.count({ where: { commentId } });
    }

    async isPostLikedByUser(userId: number, postId: number): Promise<boolean> {
        const like = await this.likeRepository.findOne({
            where: { userId, postId }
        });
        // !! : 값을 boolean으로 바꿀 때 쓰는 자바스크립트 관용 표현
        // !!like: like가 있으면 true, null/undefined면 false.
        return !!like;
    }

    async isCommentLikedByUser(userId: number, commentId: number): Promise<boolean> {
        const like = await this.likeRepository.findOne({
            where: { userId, commentId }
        });
        return !!like;
    }


}