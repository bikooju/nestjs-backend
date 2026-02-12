import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Like } from "./entity/like.entity";
import { LikeController } from "./like.controller";
import { LikeService } from "./like.service";

@Module({
    imports: [TypeOrmModule.forFeature([Like])],
    controllers: [LikeController],
    providers: [LikeService],
    exports: [LikeService]
})
export class LikeModule { }