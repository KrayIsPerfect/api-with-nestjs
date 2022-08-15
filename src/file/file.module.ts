import { Module } from '@nestjs/common';

import { DatabaseModule } from "../database/database.module";

import { FileService } from './file.service';
import { publicFileProviders } from './public.file.providers';


@Module({
  exports: [FileService],
  imports: [DatabaseModule],
  providers: [
    ...publicFileProviders,
    FileService,
  ],
})
export class FileModule {}
