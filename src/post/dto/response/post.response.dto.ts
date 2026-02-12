import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from 'src/user/dto/response/user.response.dto';
import { CategoryResponseDto } from 'src/category/dto/response/category.response.dto';

export class PostResponseDto {
    @ApiProperty({ example: 1, description: '게시글 ID' })
    id: number;

    @ApiProperty({ example: '제목입니다.', description: '제목' })
    title: string;

    @ApiProperty({ example: '내용입니다.', description: '내용' })
    content: string;

    @ApiProperty({ example: 10, description: '조회수' })
    viewCount: number;

    // type: () => UserResponseDto로 함수로 전달 [DTO 중첩]
    @ApiProperty({ type: () => UserResponseDto, description: '작성자 정보' })
    author: UserResponseDto;

    @ApiProperty({ type: () => CategoryResponseDto, description: '카테고리 정보' })
    category: CategoryResponseDto;

    @ApiProperty({ example: '2026-02-10T10:00:00.000Z', description: '작성일' })
    createdAt: Date;

    @ApiProperty({ example: '2026-02-10T10:00:00.000Z', description: '수정일' })
    updatedAt: Date;

    @ApiProperty({ example: 15, description: '좋아요 개수', required: false })
    likeCount?: number;

    @ApiProperty({ example: true, description: '현재 사용자가 좋아요 했는지', required: false })
    isLiked?: boolean;

    constructor(partial: Partial<PostResponseDto>) {
        Object.assign(this, partial);
    }
}