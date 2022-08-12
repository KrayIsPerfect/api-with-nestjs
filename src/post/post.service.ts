import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";

import User from '../user/user.entity';

import { PostCreateDto } from "./dto/post.create.dto";
import { PostUpdateDto } from "./dto/post.update.dto";
import { PostNotFoundException } from './exception/post.not.found.exception';
import Post from "./post.entity";

@Injectable()
export default class PostService {
  constructor(
    @Inject('POST_REPOSITORY')
    private readonly postRepository: Repository<Post>,
  ) {
  }


  getAllPosts() {
    return this.postRepository.find({ relations: ['author'] });
  }

  async getPostById(id: number) {
    const post = await this.postRepository.findOne(id, { relations: ['author'] });
    if (post) {
      return post;
    }
    throw new PostNotFoundException(id);
  }

  async updatePost(id: number, post: PostUpdateDto) {
    await this.postRepository.update(id, post);
    const updatedPost = await this.postRepository.findOne(id, { relations: ['author'] });
    if (updatedPost) {
      return updatedPost
    }
    throw new PostNotFoundException(id);
  }

  async createPost(post: PostCreateDto, user: User) {
    const newPost = await this.postRepository.create({
      ...post,
      author: user,
    });
    await this.postRepository.save(newPost);
    return newPost;
  }

  async deletePost(id: number) {
    const deleteResponse = await this.postRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
  }
}
