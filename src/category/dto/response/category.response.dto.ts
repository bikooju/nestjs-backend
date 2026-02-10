import { ApiProperty } from "@nestjs/swagger";

export class CategoryResponseDto {
    @ApiProperty({ example: 1, description: '카테고리 ID' })
    id: number;

    @ApiProperty({ example: '자유게시판', description: '카테고리 이름' })
    name: string;

    @ApiProperty({
        example: '자유롭게 이야기하는 공간입니다',
        description: '카테고리 설명',
        nullable: true,
    })
    description: string | null;

    @ApiProperty({
        example: '2024-01-15T10:00:00.000Z',
        description: '생성일'
    })
    createdAt: Date;

    @ApiProperty({
        example: '2024-01-15T10:00:00.000Z',
        description: '수정일'
    })
    updatedAt: Date;

    constructor(partial: Partial<CategoryResponseDto>) {
        Object.assign(this, partial);
    }
}