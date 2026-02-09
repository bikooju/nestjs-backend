import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserResponseDto } from './dto/response/user.response.dto';
import { Public } from 'src/auth/decorator/public.decorator';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { User } from './entity/user.entity';
import { UpdateProfileRequestDto } from './dto/request/update-profile.request.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '내 정보 조회' })
  @ApiResponse({
    status: 200,
    description: '조회 성공',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패',
  })
  async getMe(@CurrentUser() user: User): Promise<UserResponseDto> {
    return this.userService.findById(user.id);
  }

  @Patch('me')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '내 정보 수정' })
  @ApiResponse({
    status: 200,
    description: '수정 성공',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패',
  })
  @ApiResponse({
    status: 400,
    description: '입력값 검증 실패',
  })
  async updateMe(
    @CurrentUser() user: User,
    @Body() dto: UpdateProfileRequestDto,
  ): Promise<UserResponseDto> {
    return this.userService.updateProfile(user.id, dto);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: '특정 사용자 조회' })
  @ApiResponse({ status: 200, description: '조회 성공', type: UserResponseDto })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없음' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserResponseDto> {
    return this.userService.findById(id);
  }
}
