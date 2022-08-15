import { Module } from '@nestjs/common';

import { DatabaseModule } from "../database/database.module";
import { FileModule } from '../file/file.module';

import { userProviders } from "./user.providers";
import { UserService } from "./user.service";

@Module({
  exports: [UserService],
  imports: [DatabaseModule, FileModule],
  providers: [
    ...userProviders,
    UserService
  ],
})
export class UserModule {}