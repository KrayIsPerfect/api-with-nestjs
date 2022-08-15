import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

import PublicFile from './public.file.entity';

@Injectable()
export class FileService {
  constructor(
    @Inject('PUBLIC_FILE_REPOSITORY')
    private publicFileRepository: Repository<PublicFile>,
    private readonly configService: ConfigService
  ) {}

  async uploadPublicFile(dataBuffer: Buffer, filename: string) {
    const s3 = new S3({
      accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY_ID'),
      endpoint: this.configService.get('AWS_S3_API_ENDPOINT'),
      s3ForcePathStyle: true,
      secretAccessKey: this.configService.get('AWS_S3_SECRET_ACCESS_KEY'),
      signatureVersion: 'v4',
    });

    const uploadResult = await s3
      .upload({
        Body: dataBuffer,
        Bucket: this.configService.get('AWS_S3_BUCKET_NAME', 'api-with-nestjs') ,
        ContentDisposition: `attachment; filename=${encodeURIComponent(
          filename,
        )}`,
        Key: `${uuid()}-${filename}`,
      })
      .promise();

    const newFile = this.publicFileRepository.create({
      key: uploadResult.Key,
      url: uploadResult.Location
    });
    await this.publicFileRepository.save(newFile);
    return newFile;
  }

  async deletePublicFile(fileId: number) {
    const file = await this.publicFileRepository.findOneOrFail({ id: fileId });
    const s3 = new S3({
      accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY_ID'),
      endpoint: this.configService.get('AWS_S3_API_ENDPOINT'),
      s3ForcePathStyle: true,
      secretAccessKey: this.configService.get('AWS_S3_SECRET_ACCESS_KEY'),
      signatureVersion: 'v4',
    });
    await s3.deleteObject({
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME', 'api-with-nestjs') ,
      Key: file.key,
    }).promise();
    await this.publicFileRepository.delete(fileId);
  }
}