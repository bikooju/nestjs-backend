import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from 'src/user/dto/response/user.response.dto';

export class AuthResponseDto {
  @ApiProperty({
    description: '사용자 정보',
    type: UserResponseDto,
  })
  user: UserResponseDto;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Access Token (15분)',
  })
  accessToken: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Refresh Token (7일)',
  })
  refreshToken: string;
}
