import { Controller, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { LikeService } from "./like.service";
import { CurrentUser } from "src/auth/decorator/current-user.decorator";
import { User } from "src/user/entity/user.entity";
import { Public } from "src/auth/decorator/public.decorator";

@ApiTags('Likes')
@Controller()
export class LikeController {
    constructor(private readonly likeService: LikeService) { }

    @Post('posts/:postId/like')
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: '게시글 좋아요 토글' })
    @ApiResponse({
        status: 201,
        description: '성공',
        schema: {
            example: { liked: true },
        },
    })
    @ApiResponse({
        status: 401,
        description: '인증 실패',
    })
    async togglePostLike(
        @Param('postId', ParseIntPipe) postId: number,
        @CurrentUser() user: User,
    ): Promise<{ liked: boolean }> {
        return this.likeService.togglePostLike(user.id, postId);
    }

    @Post('comments/:commentId/like')
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: '댓글 좋아요 토글' })
    @ApiResponse({
        status: 201,
        description: '성공',
        schema: {
            example: { liked: true },
        },
    })
    @ApiResponse({
        status: 401,
        description: '인증 실패',
    })
    async toggleCommentLike(
        @Param('commentId', ParseIntPipe) commentId: number,
        @CurrentUser() user: User
    ): Promise<{ liked: boolean }> {
        return this.likeService.toggleCommentLike(user.id, commentId);
    }

}