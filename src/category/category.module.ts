import { Module } from "@nestjs/common";
import { Category } from "./entity/category.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";

@Module({
    imports: [TypeOrmModule.forFeature([Category])],
    controllers: [CategoryController],
    providers: [CategoryService],
    exports: [CategoryService]
})
export class CategoryModule { }
