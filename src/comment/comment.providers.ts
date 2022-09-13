import { Connection, Repository } from 'typeorm';

import Comment from './comment.entity';

export const commentProviders = [
  {
    inject: ['DATABASE_CONNECTION'],
    provide: 'COMMENT_REPOSITORY',
    useFactory: (connection: Connection): Repository<Comment> =>
      connection.getRepository(Comment),
  },
];
