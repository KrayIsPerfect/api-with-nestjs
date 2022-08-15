import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
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
}