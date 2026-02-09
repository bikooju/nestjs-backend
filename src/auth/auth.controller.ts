import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthResponseDto } from './dto/response/auth.response.dto';
import { SignUpRequestDto } from './dto/request/signup.request.dto';
import { LoginRequestDto } from './dto/request/login.request.dto';
import { Public } from './decorator/public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  @ApiOperation({ summary: '회원가입' })
  @ApiResponse({
    status: 201,
    description: '회원가입 성공',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: '이미 존재하는 이메일',
  })
  @ApiResponse({
    status: 400,
    description: '입력값 검증 실패',
  })
  async signUp(@Body() dto: SignUpRequestDto): Promise<AuthResponseDto> {
    return this.authService.signUp(dto);
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: '로그인' })
  @ApiResponse({
    status: 200,
    description: '로그인 성공',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '이메일 또는 비밀번호가 틀림',
  })
  @ApiResponse({
    status: 400,
    description: '입력값 검증 실패',
  })
  async login(@Body() dto: LoginRequestDto): Promise<AuthResponseDto> {
    return this.authService.login(dto);
  }
}
