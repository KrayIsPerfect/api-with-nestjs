import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER } from "@nestjs/core";
import Joi from 'joi';

import { CategoryModule } from './category/category.module';
import { DatabaseModule } from "./database/database.module";
import { FileModule } from './file/file.module';
import { PostModule } from './post/post.module';
import { UserModule } from "./user/user.module";
import { ExceptionsLoggerFilter } from "./utils/exception.logger.filter";
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationOptions: {
        abortEarly: true,
      },
      validationSchema: Joi.object({
        AWS_S3_ACCESS_KEY_ID: Joi.string().required(),
        AWS_S3_API_ENDPOINT: Joi.string().required(),
        AWS_S3_BUCKET_NAME: Joi.string().required(),
        AWS_S3_SECRET_ACCESS_KEY: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_TYPE: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        PORT: Joi.number().required(),
      })
    }),
    DatabaseModule,
    FileModule,
    CategoryModule,
    PostModule,
    UserModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ExceptionsLoggerFilter,
    },
    AppService
  ],
})
export class AppModule {}
