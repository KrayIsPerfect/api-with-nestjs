import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';

import Comment from '../../comment.entity';
import { GetCommentsQuery } from '../implementations/get.comments.query';

@QueryHandler(GetCommentsQuery)
export class GetCommentsHandler implements IQueryHandler<GetCommentsQuery> {
  constructor(
    @Inject('COMMENT_REPOSITORY')
    private commentsRepository: Repository<Comment>,
  ) {}

  async execute(query: GetCommentsQuery) {
    if (query.postId) {
      return this.commentsRepository.find({
        post: {
          id: query.postId
        }
      });
    }
    return this.commentsRepository.find();
  }
}
