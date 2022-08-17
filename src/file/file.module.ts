import { Module } from '@nestjs/common';

import { DatabaseModule } from "../database/database.module";

import { FileService } from './file.service';
import { privateFileProviders } from './private.file.providers';
import { publicFileProviders } from './public.file.providers';


@Module({
  exports: [FileService],
  imports: [DatabaseModule],
  providers: [
    ...privateFileProviders,
    ...publicFileProviders,
    FileService,
  ],
})
export class FileModule {}
