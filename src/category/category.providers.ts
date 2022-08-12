import { Connection, Repository } from 'typeorm';

import Category from './category.entity';

export const categoryProviders = [
  {
    inject: ['DATABASE_CONNECTION'],
    provide: 'CATEGORY_REPOSITORY',
    useFactory: (connection: Connection): Repository<Category> =>
      connection.getRepository(Category),
  },
];
