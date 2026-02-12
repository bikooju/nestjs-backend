import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PostService } from "./post.service";
import { Public } from "src/auth/decorator/public.decorator";
import { PostListResponseDto } from "./dto/response/post-list.response.dto";
import { GetPostsRequestDto } from "./dto/request/get-posts.request.dto";
import { PostResponseDto } from "./dto/response/post.response.dto";
import { CurrentUser } from "src/auth/decorator/current-user.decorator";
import { User } from "src/user/entity/user.entity";
import { CreatePostRequestDto } from "./dto/request/create-post.request.dto";
import { UpdatePostRequestDto } from "./dto/request/update-post.request.dto";

@ApiTags('Posts')
@Controller('posts')
export class PostController {
    constructor(private readonly postService: PostService) { }

    @Public()
    @Get()
    @ApiOperation({ summary: '게시글 목록 조회 (페이지네이션)' })
    @ApiResponse({
        status: 200,
        description: '조회 성공',
        type: PostListResponseDto,
    })
    // @Query() : URL Query 파라미터를 DTO로 변환
    async findAll(@Query() dto: GetPostsRequestDto): Promise<PostListResponseDto> {
        return this.postService.findAll(dto);
    }

    @Public()
    @Get(':id')
    @ApiOperation({ summary: '게시글 상세 조회' })
    @ApiResponse({
        status: 200,
        description: '조회 성공',
        type: PostResponseDto,
    })
    @ApiResponse({
        status: 404,
        description: '게시글을 찾을 수 없음',
    })
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<PostResponseDto> {
        await this.postService.incrementViewCount(id);
        return this.postService.findOne(id);
    }

    @Post()
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: '게시글 작성' })
    @ApiResponse({
        status: 201,
        description: '작성 성공',
        type: PostResponseDto,
    })
    @ApiResponse({
        status: 401,
        description: '인증 실패',
    })
    @ApiResponse({
        status: 404,
        description: '카테고리를 찾을 수 없음',
    })
    async create(
        @CurrentUser() user: User,
        @Body() dto: CreatePostRequestDto
    ): Promise<PostResponseDto> {
        return this.postService.create(user.id, dto);
    }

    @Patch(':id')
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: '게시글 수정 (작성자 또는 관리자)' })
    @ApiResponse({
        status: 200,
        description: '수정 성공',
        type: PostResponseDto,
    })
    @ApiResponse({
        status: 401,
        description: '인증 실패',
    })
    @ApiResponse({
        status: 403,
        description: '권한 없음',
    })
    @ApiResponse({
        status: 404,
        description: '게시글 또는 카테고리를 찾을 수 없음',
    })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() user: User,
        @Body() dto: UpdatePostRequestDto
    ): Promise<PostResponseDto> {
        return this.postService.update(id, user.id, user.role, dto);
    }

    @Delete(':id')
    @ApiBearerAuth('access-token')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: '게시글 삭제 (작성자 또는 관리자)' })
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
        description: '권한 없음',
    })
    @ApiResponse({
        status: 404,
        description: '게시글을 찾을 수 없음',
    })
    async delete(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() user: User,
    ): Promise<void> {
        return this.postService.delete(id, user.id, user.role);
    }
}