import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { FindManyOptions, MoreThan, Repository } from 'typeorm';

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

  async getAllPosts(offset?: number, limit?: number, startId?: number) {
    const where: FindManyOptions<Post>['where'] = {};
    let separateCount = 0;
    if (startId) {
      where.id = MoreThan(startId);
      separateCount = await this.postRepository.count();
    }

    const [items, count] = await this.postRepository.findAndCount({
      order: {
        id: 'ASC'
      },
      relations: ['author'],
      skip: offset,
      take: limit,
      where,
    });

    return {
      count: startId ? separateCount : count,
      items,
    }
  }

  async getPostsWithParagraph(paragraph: string) {
    return this.postRepository
      .query('SELECT * from post WHERE $1 = ANY(paragraphs)', [paragraph]);
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
