import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CommentService } from "./comment.service";
import { Public } from "src/auth/decorator/public.decorator";
import { CommentResponseDto } from "./dto/response/comment.response.dto";
import { CurrentUser } from "src/auth/decorator/current-user.decorator";
import { User } from "src/user/entity/user.entity";
import { CreateCommentRequestDto } from "./dto/request/create-comment.request.dto";
import { UpdateCommentRequestDto } from "./dto/request/update-comment.request.dto";

@ApiTags('Comments')
@Controller('posts/:postId/comments')
export class CommentController {
    constructor(private readonly commentService: CommentService) { }

    @Public()
    @Get()
    @ApiOperation({ summary: '게시글의 댓글 목록 조회' })
    @ApiResponse({
        status: 200,
        description: '조회 성공',
        type: [CommentResponseDto],
    })
    async findByPostId(@Param('postId', ParseIntPipe) postId: number
    ): Promise<CommentResponseDto[]> {
        return this.commentService.findByPostId(postId);
    }

    @Post()
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: '댓글 작성' })
    @ApiResponse({
        status: 201,
        description: '작성 성공',
        type: CommentResponseDto,
    })
    @ApiResponse({
        status: 401,
        description: '인증 실패',
    })
    async create(
        @Param('postId', ParseIntPipe) postId: number,
        @CurrentUser() user: User,
        @Body() dto: CreateCommentRequestDto
    ): Promise<CommentResponseDto> {
        return this.commentService.create(postId, user.id, dto);
    }

    @Patch(':id')
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: '댓글 수정 (작성자 또는 관리자)' })
    @ApiResponse({
        status: 200,
        description: '수정 성공',
        type: CommentResponseDto,
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
        description: '댓글을 찾을 수 없음',
    })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() user: User,
        @Body() dto: UpdateCommentRequestDto,
    ): Promise<CommentResponseDto> {
        return this.commentService.update(id, user.id, user.role, dto);
    }

    @Delete(':id')
    @ApiBearerAuth('access-token')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: '댓글 삭제 (작성자 또는 관리자)' })
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
        description: '댓글을 찾을 수 없음',
    })
    async delete(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() user: User,
    ): Promise<void> {
        return this.commentService.delete(id, user.id, user.role);
    }


}