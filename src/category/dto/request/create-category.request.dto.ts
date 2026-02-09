import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCategoryRequestDto {
  @ApiProperty({
    example: '자유게시판',
    description: '카테고리 이름',
  })
  @IsString()
  @MinLength(2, { message: '카테고리 이름은 최소 2자 이상이어야 합니다' })
  @MaxLength(50, { message: '카테고리 이름은 최대 50자까지 가능합니다' })
  name: string;

  @ApiProperty({
    example: '자유롭게 이야기 하는 공간입니다',
    description: '카테고리 설명',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: '카테고리 설명은 최대 500자까지 가능합니다' })
  description?: string;
}
