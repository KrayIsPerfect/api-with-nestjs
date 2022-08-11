import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put, UseGuards
} from "@nestjs/common";

import JwtAuthenticationGuard from "../authentication/jwt.authentication.guard";

import { PostCreateDto } from './dto/post.create.dto';
import { PostUpdateDto } from './dto/post.update.dto';
import PostService from './post.service';

@Controller()
export default class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  getAllPosts() {
    return this.postService.getAllPosts();
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  getPostById(@Param('id') id: string) {
    return this.postService.getPostById(Number(id));
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async createPost(@Body() post: PostCreateDto) {
    return this.postService.createPost(post);
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
