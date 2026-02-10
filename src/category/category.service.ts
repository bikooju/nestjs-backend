import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "./entity/category.entity";
import { Repository } from "typeorm";
import { CreateCategoryRequestDto } from "./dto/request/create-category.request.dto";
import { CategoryResponseDto } from "./dto/response/category.response.dto";
import { UpdateCategoryRequestDto } from "./dto/request/update-category.request.dto";

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>
    ) { }

    async create(dto: CreateCategoryRequestDto): Promise<CategoryResponseDto> {
        // 이름 중복 체크
        const existing = await this.categoryRepository.findOne({
            where: { name: dto.name }
        })

        if (existing) {
            throw new ConflictException('이미 존재하는 카테고리 이름입니다.');
        }

        const cateogory = this.categoryRepository.create(dto);
        const saved = await this.categoryRepository.save(cateogory);

        return new CategoryResponseDto(saved);
    }

    async findAll(): Promise<CategoryResponseDto[]> {
        const categories = await this.categoryRepository.find({
            order: { createdAt: 'DESC' }
        })

        return categories.map((category) => new CategoryResponseDto(category));
    }

    async findOne(id: number): Promise<CategoryResponseDto> {
        const category = await this.categoryRepository.findOne({ where: { id } })

        if (!category) {
            throw new NotFoundException('카테고리를 찾을 수 없습니다.');
        }

        return new CategoryResponseDto(category);
    }

    async update(
        id: number,
        dto: UpdateCategoryRequestDto,
    ): Promise<CategoryResponseDto> {
        const category = await this.categoryRepository.findOne({ where: { id } })

        if (!category) {
            throw new NotFoundException('카테고리를 찾을 수 없습니다.');
        }

        // 이름 변경 시 중복 체크
        if (dto.name && dto.name !== category.name) {
            const existing = await this.categoryRepository.findOne({ where: { name: dto.name } })

            if (existing) {
                throw new ConflictException('이미 존재하는 카테고리 이름입니다.');
            }
        }

        if (dto.name !== undefined) {
            category.name = dto.name;
        }

        if (dto.description !== undefined) {
            category.description = dto.description;
        }

        const updated = await this.categoryRepository.save(category);

        return new CategoryResponseDto(updated);
    }

    async delete(id: number): Promise<void> {
        const category = await this.categoryRepository.findOne({ where: { id } })

        if (!category) {
            throw new NotFoundException('카테고리를 찾을 수 없습니다.');
        }

        // 추후에 hard delete 처리 필요, Post도 같이 삭제되어야 함
        await this.categoryRepository.softDelete(id);
    }
}