import { Connection, Repository } from 'typeorm';

import PublicFile from './public.file.entity';

export const publicFileProviders = [
  {
    inject: ['DATABASE_CONNECTION'],
    provide: 'PUBLIC_FILE_REPOSITORY',
    useFactory: (connection: Connection): Repository<PublicFile> =>
      connection.getRepository(PublicFile),
  },
];
