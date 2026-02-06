import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // 1) JWT 시크릿 키: .env의 JWT_SECRET을 읽어옴.
        //    get()은 값이 없으면 undefined를 주기 때문에, 없으면 앱이 잘못 동작하기 전에 여기서 에러를 던짐.
        const secret = configService.get<string>('JWT_SECRET');
        if (!secret) throw new Error('JWT_SECRET is required');

        // 2) 토큰 만료 시간: .env에 JWT_ACCESS_EXPIRATION이 없으면 기본값 '15분' 사용.
        //    TypeScript는 '15m', '7d' 같은 형식만 허용하는 타입(StringValue)을 요구해서, as로 "이 문자열은 그 형식이 맞다"고 알려줌.
        const expiresIn =
          configService.get<string>('JWT_ACCESS_EXPIRATION') ?? '15m';
        return {
          secret,
          signOptions: {
            expiresIn: expiresIn as import('ms').StringValue,
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
