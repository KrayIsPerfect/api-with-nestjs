import { Connection, Repository } from 'typeorm';

import PrivateFile from './private.file.entity';

export const privateFileProviders = [
  {
    inject: ['DATABASE_CONNECTION'],
    provide: 'PRIVATE_FILE_REPOSITORY',
    useFactory: (connection: Connection): Repository<PrivateFile> =>
      connection.getRepository(PrivateFile),
  },
];
