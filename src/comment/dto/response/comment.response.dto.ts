import { ApiProperty } from "@nestjs/swagger";
import { UserResponseDto } from "src/user/dto/response/user.response.dto";

export class CommentResponseDto {
    @ApiProperty({ example: 1, description: '댓글 ID' })
    id: number;

    @ApiProperty({ example: '좋은 글 감사합니다!', description: '댓글 내용' })
    content: string;

    @ApiProperty({ type: () => UserResponseDto, description: '작성자 정보' })
    author: UserResponseDto;

    @ApiProperty({ example: 1, description: '게시글 ID' })
    postId: number;

    @ApiProperty({ example: '2026-02-12T10:00:00.000Z', description: '작성일' })
    createdAt: Date;

    @ApiProperty({ example: '2024-02-12T10:00:00.000Z', description: '수정일' })
    updatedAt: Date;

    @ApiProperty({ example: 5, description: '좋아요 개수', required: false })
    likeCount?: number;

    @ApiProperty({ example: false, description: '현재 사용자가 좋아요 했는지', required: false })
    isLiked?: boolean;

    /**
    * 엔티티 등에서 넘긴 객체의 일부 필드만으로 DTO 인스턴스를 만들 때 사용.
    * partial에 있는 속성만 this(CommentResponseDto)에 복사한다.
    */
    constructor(partial: Partial<CommentResponseDto>) {
        Object.assign(this, partial);
    }

}