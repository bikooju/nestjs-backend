import { ApiProperty } from "@nestjs/swagger";
import { PostResponseDto } from "./post.response.dto";

export class PostListResponseDto {
    @ApiProperty({ type: () => [PostResponseDto], description: '게시글 목록' })
    posts: PostResponseDto[];

    @ApiProperty({
        example: {
            total: 100,
            page: 1,
            limit: 10,
            totalPages: 10,
        },
        description: '페이지네이션 정보'
    })
    meta: {
        total: number; // 전체 게시글 수
        page: number; // 현재 페이지 번호
        limit: number; // 페이지당 게시글 수
        totalPages: number; // 전체 페이지 수
    }
}