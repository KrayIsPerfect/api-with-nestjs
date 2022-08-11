import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { databaseProviders } from './database.providers';

@Module({
  exports: [...databaseProviders],
  imports: [ConfigModule],
  providers: [...databaseProviders],
})
export class DatabaseModule {}
