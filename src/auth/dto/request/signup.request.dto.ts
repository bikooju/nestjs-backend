import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class SignUpRequestDto {
  @ApiProperty({
    example: 'jhjk1234@gmail.com',
    description: '이메일',
  })
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다' })
  email: string;

  @ApiProperty({
    example: 'password123!',
    description: '비밀번호',
    minLength: 6,
  })
  @IsString()
  @MinLength(6, { message: '비밀번호는 최소 6자 이상이어야 합니다' })
  password: string;

  @ApiProperty({
    example: '비쿠',
    description: '사용자 이름',
    minLength: 2,
    maxLength: 20,
  })
  @IsString()
  @MinLength(2, { message: '이름은 최소 2자 이상이어야 합니다' })
  @MaxLength(20, { message: '이름은 최대 20자 이하여야 합니다' })
  name: string;
}
