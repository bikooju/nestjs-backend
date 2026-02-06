import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/user/enums/user-role.enum';

export class UserResponseDto {
  @ApiProperty({ example: 1, description: '사용자 ID' })
  id: number;

  @ApiProperty({ example: 'user@example.com', description: '이메일' })
  email: string;

  @ApiProperty({ example: '비쿠', description: '이름' })
  name: string;

  @ApiProperty({ enum: UserRole, example: UserRole.USER, description: '역할' })
  role: UserRole;

  @ApiProperty({ example: '2026-01-01', description: '가입일' })
  createdAt: Date;

  constructor(partial: Partial<UserResponseDto>) {
    // 응답에 넣을 필드만 명시해서 할당. password는 절대 복사하지 않음.
    this.id = partial.id as number;
    this.email = partial.email as string;
    this.name = partial.name as string;
    this.role = partial.role as UserRole;
    this.createdAt = partial.createdAt as Date;
  }
}
