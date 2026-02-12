import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class CreateCommentRequestDto {
    @ApiProperty({
        example: '좋은 글 감사합니다',
        description: '댓글 내용',
    })
    @IsString()
    @MinLength(1, { message: '댓글 내용은 최소 1자 이상이어야 합니다' })
    content: string;
}