import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, MaxLength, Min, MinLength } from "class-validator";

export class CreatePostRequestDto {
    @ApiProperty({
        example: '게시글 제목 입니다',
        description: '게시글 제목',
    })
    @IsString()
    @MinLength(2, { message: '제목은 최소 2자 이상이어야 합니다' })
    @MaxLength(100, { message: '제목은 최대 100자까지 가능합니다' })
    title: string;

    @ApiProperty({
        example: '게시글 내용입니다',
        description: '게시글 내용',
    })
    @IsString()
    @MinLength(10, { message: '내용은 최소 10자 이상이어야 합니다' })
    content: string;

    @ApiProperty({
        example: 1,
        description: '카테고리 ID',
    })
    @IsNumber()
    categoryId: number;
}