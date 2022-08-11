import { Connection, Repository } from 'typeorm';

import Post from "./post.entity";

export const postProviders = [
  {
    inject: ['DATABASE_CONNECTION'],
    provide: 'POST_REPOSITORY',
    useFactory: (connection: Connection): Repository<Post> =>
      connection.getRepository(Post),
  },
];
