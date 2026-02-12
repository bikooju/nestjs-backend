import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Post } from "./entity/post.entity";
import { CategoryModule } from "src/category/category.module";
import { LikeModule } from "src/like/like.module";
import { PostController } from "./post.controller";
import { PostService } from "./post.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Post]),
        CategoryModule, // CategoryService 사용
        LikeModule, // LikeService 사용
    ],
    controllers: [PostController],
    providers: [PostService],
    exports: [PostService]
})
export class PostModule { }