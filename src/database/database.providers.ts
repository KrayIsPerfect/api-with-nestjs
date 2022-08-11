import { ConfigService } from '@nestjs/config';
import { Connection, createConnection } from 'typeorm';

export const databaseProviders = [
  {
    inject: [ConfigService],
    provide: 'DATABASE_CONNECTION',
    useFactory: (config: ConfigService): Promise<Connection> => {
      return createConnection({
        database: config.get('DB_DATABASE'),
        entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
        host: config.get('DB_HOST'),
        logging: true,
        password: config.get('DB_PASSWORD'),
        port: config.get('DB_PORT'),
        synchronize: true,
        type: config.get('DB_TYPE'),
        username: config.get('DB_USERNAME'),
      });
    },
  },
];
