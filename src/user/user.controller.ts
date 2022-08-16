import { Controller, Get, Param, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import JwtAuthenticationGuard from '../authentication/jwt.authentication.guard';
import RequestWithUser from '../authentication/request.with.user.interface';
import { FindOneParams } from '../utils/find.one.params';

import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Post('avatar')
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(FileInterceptor('file'))
  async addAvatar(@Req() request: RequestWithUser, @UploadedFile() file: { buffer: Buffer, originalname: string }) {
    return this.userService.addAvatar(request.user.id, file.buffer, file.originalname);
  }

  @Post('files')
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(FileInterceptor('file'))
  async addPrivateFile(@Req() request: RequestWithUser, @UploadedFile() file: { buffer: Buffer, originalname: string }) {
    return this.userService.addPrivateFile(request.user.id, file.buffer, file.originalname);
  }

  @Get('files/:id')
  @UseGuards(JwtAuthenticationGuard)
  async getPrivateFile(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
    @Res() res: Response
  ) {
    const file = await this.userService.getPrivateFile(request.user.id, Number(id));
    // file.stream.pipe(res);
    return file;
  }


  @Get('files')
  @UseGuards(JwtAuthenticationGuard)
  async getAllPrivateFiles(@Req() request: RequestWithUser) {
    return this.userService.getAllPrivateFiles(request.user.id);
  }
}