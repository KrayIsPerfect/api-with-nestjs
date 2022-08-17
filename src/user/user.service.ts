import assert from 'assert';

import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { FileService } from '../file/file.service';

import UserCreateDto from "./dto/user.create.dto";
import User from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: Repository<User>,
    private readonly fileService: FileService
  ) {}

  async getByEmail(email: string) {
    const user = await this.userRepository.findOne({ email });
    if (user) {
      return user;
    }
    throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND);
  }

  async getById(id: number) {
    const user = await this.userRepository.findOne({ id });
    if (user) {
      return user;
    }
    throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
  }

  async create(userData: UserCreateDto) {
    const newUser = await this.userRepository.create(userData);
    await this.userRepository.save(newUser);
    return newUser;
  }

  async addAvatar(userId: number, imageBuffer: Buffer, filename: string) {
    const avatar = await this.fileService.uploadPublicFile(imageBuffer, filename);
    const user = await this.getById(userId);
    await this.userRepository.update(userId, {
      ...user,
      avatar
    });
    return avatar;
  }

  async deleteAvatar(userId: number) {
    const user = await this.getById(userId);
    const fileId = user.avatar?.id;
    if (fileId) {
      await this.userRepository.update(userId, {
        ...user,
        avatar: null
      });
      await this.fileService.deletePublicFile(fileId)
    }
  }

  async addPrivateFile(userId: number, imageBuffer: Buffer, filename: string) {
    return this.fileService.uploadPrivateFile(imageBuffer, userId, filename);
  }

  async getPrivateFile(userId: number, fileId: number) {
    const file = await this.fileService.getPrivateFile(fileId);
    if (file.info.owner.id === userId) {
      return file;
    }
    throw new UnauthorizedException();
  }

  async getAllPrivateFiles(userId: number) {
    const userWithFiles = await this.userRepository.findOne(
      { id: userId },
      { relations: ['files'] }
    );
    if (userWithFiles) {
      return Promise.all(
        userWithFiles.files.map(async (file) => {
          const url = await this.fileService.generatePreassignedUrl(file.key);
          return {
            ...file,
            url
          }
        })
      )
    }
    throw new NotFoundException('User with this id does not exist');
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(userId, {
      currentHashedRefreshToken
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.getById(userId);

    assert(user.currentHashedRefreshToken, `${user.name} refresh token undefined`);

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async removeRefreshToken(userId: number) {
    return this.userRepository.update(userId, {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      currentHashedRefreshToken: null
    });
  }
}