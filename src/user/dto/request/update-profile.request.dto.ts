import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateProfileRequestDto {
  @ApiProperty({
    example: '수정한비쿠',
    description: '변경할 이름',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: '이름은 최소 2자 이상이어야 합니다' })
  @MaxLength(20, { message: '이름은 최대 20자까지 가능합니다' })
  name?: string;
}
