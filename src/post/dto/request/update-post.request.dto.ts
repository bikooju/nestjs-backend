import { IsString, IsNumber, IsOptional, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostRequestDto {
    @ApiProperty({
        example: '수정된 제목',
        description: '변경할 제목',
        required: false,
    })
    @IsOptional()
    @IsString()
    @MinLength(2, { message: '제목은 최소 2자 이상이어야 합니다' })
    @MaxLength(100, { message: '제목은 최대 100자까지 가능합니다' })
    title?: string;

    @ApiProperty({
        example: '수정된 내용입니다',
        description: '변경할 내용',
        required: false,
    })
    @IsOptional()
    @IsString()
    @MinLength(10, { message: '내용은 최소 10자 이상이어야 합니다' })
    content?: string;

    @ApiProperty({
        example: 2,
        description: '변경할 카테고리 ID',
        required: false,
    })
    @IsOptional()
    @IsNumber()
    categoryId?: number;
}