import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { CreateCommentHandler } from './commands/handlers/create.comment.handler';
import { GetCommentsHandler } from './queries/handlers/get.comments.handler';
import CommentsController from './comment.controller';
import { commentProviders } from './comment.providers';

@Module({
  controllers: [CommentsController],
  imports: [CqrsModule],
  providers: [...commentProviders, CreateCommentHandler, GetCommentsHandler],
})
export class CommentModule {}