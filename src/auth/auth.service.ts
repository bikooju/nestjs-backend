import { SignUpRequestDto } from './dto/request/signup.request.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './../user/user.service';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthResponseDto } from './dto/response/auth.response.dto';
import * as bcrypt from 'bcrypt';
import { UserResponseDto } from 'src/user/dto/response/user.response.dto';
import { User } from 'src/user/entity/user.entity';
import { LoginRequestDto } from './dto/request/login.request.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(dto: SignUpRequestDto): Promise<AuthResponseDto> {
    const existing = await this.userService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.userService.create({
      email: dto.email,
      password: hashedPassword,
      name: dto.name,
    });

    const tokens = this.generateTokens(user);

    return {
      user: new UserResponseDto(user),
      ...tokens,
    };
  }

  async login(dto: LoginRequestDto): Promise<AuthResponseDto> {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 틀렸습니다.');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 틀렸습니다.');
    }

    const tokens = this.generateTokens(user);

    return {
      user: new UserResponseDto(user),
      ...tokens,
    };
  }

  private generateTokens(user: User): {
    accessToken: string;
    refreshToken: string;
  } {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }
}
