import { Controller, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import JwtAuthenticationGuard from '../authentication/jwt.authentication.guard';
import RequestWithUser from '../authentication/request.with.user.interface';

import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Post('avatar')
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(FileInterceptor('file'))
  async addAvatar(@Req() request: RequestWithUser, @UploadedFile() file: { buffer: Buffer, originalname: string },) {
    return this.userService.addAvatar(request.user.id, file.buffer, file.originalname);
  }
}