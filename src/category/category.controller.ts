import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CategoryService } from "./category.service";
import { Public } from "src/auth/decorator/public.decorator";
import { CategoryResponseDto } from "./dto/response/category.response.dto";
import { Roles } from "src/auth/decorator/roles.decorator";
import { CreateCategoryRequestDto } from "./dto/request/create-category.request.dto";
import { UserRole } from "src/user/enums/user-role.enum";
import { UpdateCategoryRequestDto } from "./dto/request/update-category.request.dto";

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) { }

    @Public()
    @Get()
    @ApiOperation({ summary: '전체 카테고리 조회' })
    @ApiResponse({
        status: 200,
        description: '조회 성공',
        type: [CategoryResponseDto],
    })
    async findAll(): Promise<CategoryResponseDto[]> {
        return this.categoryService.findAll();
    }

    @Public()
    @Get(':id')
    @ApiOperation({ summary: '특정 카테고리 조회' })
    @ApiResponse({
        status: 200,
        description: '조회 성공',
        type: CategoryResponseDto,
    })
    @ApiResponse({
        status: 404,
        description: '카테고리를 찾을 수 없음',
    })
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<CategoryResponseDto> {
        return this.categoryService.findOne(id);
    }

    @Post()
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: '카테고리 생성 (관리자 전용)' })
    @ApiResponse({
        status: 201,
        description: '생성 성공',
        type: CategoryResponseDto,
    })
    @ApiResponse({
        status: 401,
        description: '인증 실패',
    })
    @ApiResponse({
        status: 403,
        description: '권한 없음 (관리자 아님)',
    })
    @ApiResponse({
        status: 409,
        description: '이미 존재하는 카테고리 이름',
    })
    async create(@Body() dto: CreateCategoryRequestDto): Promise<CategoryResponseDto> {
        return this.categoryService.create(dto);
    }

    @Patch(':id')
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: '카테고리 수정 (관리자 전용)' })
    @ApiResponse({
        status: 200,
        description: '수정 성공',
        type: CategoryResponseDto,
    })
    @ApiResponse({
        status: 401,
        description: '인증 실패',
    })
    @ApiResponse({
        status: 403,
        description: '권한 없음 (관리자 아님)',
    })
    @ApiResponse({
        status: 404,
        description: '카테고리를 찾을 수 없음',
    })
    @ApiResponse({
        status: 409,
        description: '이미 존재하는 카테고리 이름',
    })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateCategoryRequestDto
    ): Promise<CategoryResponseDto> {
        return this.categoryService.update(id, dto);
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth('access-token')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: '카테고리 삭제 (관리자 전용)' })
    @ApiResponse({
        status: 204,
        description: '삭제 성공',
    })
    @ApiResponse({
        status: 401,
        description: '인증 실패',
    })
    @ApiResponse({
        status: 403,
        description: '권한 없음 (관리자 아님)',
    })
    @ApiResponse({
        status: 404,
        description: '카테고리를 찾을 수 없음',
    })
    async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.categoryService.delete(id);
    }


}