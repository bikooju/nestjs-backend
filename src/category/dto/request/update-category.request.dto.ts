import { IsString, MinLength, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryRequestDto {
  @ApiProperty({
    example: '자유게시판',
    description: '변경할 카테고리 이름',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: '카테고리 이름은 최소 2자 이상이어야 합니다' })
  @MaxLength(50, { message: '카테고리 이름은 최대 50자까지 가능합니다' })
  name?: string;

  @ApiProperty({
    example: '수정된 설명입니다',
    description: '변경할 카테고리 설명',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: '카테고리 설명은 최대 500자까지 가능합니다' })
  description?: string;
}
