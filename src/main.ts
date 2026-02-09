import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const reflector = app.get(Reflector);

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalInterceptors(new TransformInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 모든 API에 자동으로 JWT 인증 적용
  // 제외할려면 @Public() 데코레이터 붙이면 됨
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  const config = new DocumentBuilder()
    .setTitle('Community API')
    .setDescription('커뮤니티 백엔드 API 문서')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'JWT 토큰을 입력하세요',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document); // /swagger 경로에 Swagger UI 설정 => http://localhost:3000/swagger로 접속하면 API 문서 보임

  await app.listen(process.env.PORT || 3000);
  console.log(`Application is running on: http://localhost:3000`);
  console.log(`Swagger is running on: http://localhost:3000/swagger`);
}

bootstrap();
