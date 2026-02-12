import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Comment } from "./entity/comment.entity";
import { LikeModule } from "src/like/like.module";
import { CommentController } from "./comment.controller";
import { CommentService } from "./comment.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Comment]),
        LikeModule,
    ],
    controllers: [CommentController],
    providers: [CommentService],
    exports: [CommentService]
})
export class CommentModule { }