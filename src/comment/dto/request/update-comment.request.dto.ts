import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCommentRequestDto {
    @ApiProperty({
        example: '수정된 댓글입니다',
        description: '변경할 댓글 내용',
    })
    @IsString()
    @MinLength(1, { message: '댓글 내용은 최소 1자 이상이어야 합니다' })
    content: string;
}