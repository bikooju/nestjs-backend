import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class GetPostsRequestDto {
    @ApiProperty({
        example: 1,
        description: '페이지 번호 (1부터 시작)',
        required: false,
        default: 1,
    })
    @IsOptional()
    @Type(() => Number) // Query 파라미터를 숫자로 변환해줌
    @IsNumber()
    @Min(1)
    page?: number = 1;

    @ApiProperty({
        example: 10,
        description: '페이지당 게시글 수 (최대 50)',
        required: false,
        default: 10,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    @Max(50)
    limit?: number = 10;

    @ApiProperty({
        example: 1,
        description: '카테고리 ID로 필터링',
        required: false,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    categoryId?: number;

    @ApiProperty({
        example: '검색어',
        description: '제목 또는 내용으로 검색',
        required: false,
    })
    @IsOptional()
    @IsString()
    search?: string;





}