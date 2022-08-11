import { Connection, Repository } from 'typeorm';

import User from "./user.entity";

export const userProviders = [
  {
    inject: ['DATABASE_CONNECTION'],
    provide: 'USER_REPOSITORY',
    useFactory: (connection: Connection): Repository<User> =>
      connection.getRepository(User),
  },
];
