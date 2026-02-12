import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { LikeModule } from './like/like.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 이 모듈을 전역 모듈로 만듦
      envFilePath: '.env',
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
    CategoryModule,
    PostModule,
    CommentModule,
    LikeModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
