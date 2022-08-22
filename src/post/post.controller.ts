import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put, Query, Req, UseGuards,
} from '@nestjs/common';

import JwtAuthenticationGuard from "../authentication/jwt.authentication.guard";
import RequestWithUser from '../authentication/request.with.user.interface';
import { FindOneParams } from "../utils/find.one.params";
import { PaginationParams } from '../utils/pagination.params';

import { PostCreateDto } from './dto/post.create.dto';
import { PostUpdateDto } from './dto/post.update.dto';
import PostService from './post.service';

@Controller()
export default class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  async getPosts(
    @Query() { offset, limit }: PaginationParams
  ) {
    return this.postService.getAllPosts(offset, limit);
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  getPostById(@Param() { id }: FindOneParams) {
    return this.postService.getPostById(Number(id));
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async createPost(@Body() post: PostCreateDto, @Req() req: RequestWithUser) {
    return this.postService.createPost(post, req.user);
  }

  @Put(':id')
  @UseGuards(JwtAuthenticationGuard)
  async updatePost(@Param('id') id: string, @Body() post: PostUpdateDto) {
    return this.postService.updatePost(Number(id), post);
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  async deletePost(@Param('id') id: string) {
    this.postService.deletePost(Number(id));
  }
}
