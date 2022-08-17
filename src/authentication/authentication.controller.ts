import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { UserService } from '../user/user.service';

import RegisterDto from './dto/register.dto';
import { AuthenticationService } from './authentication.service';
import JwtAuthenticationGuard from './jwt.authentication.guard';
import JwtRefreshGuard from './jwt.refresh.guard';
import { LocalAuthenticationGuard } from './local.authentication.guard';
import RequestWithUser from './request.with.user.interface';

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly userService: UserService,
  ) {
  }

  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    return this.authenticationService.register(registrationData);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    return request.user;
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('log-in')
  async logIn(@Req() request: RequestWithUser) {
    const {user} = request;
    const accessTokenCookie = this.authenticationService.getCookieWithJwtAccessToken(user.id);
    const refreshTokenCookie = this.authenticationService.getCookieWithJwtRefreshToken(user.id);

    await this.userService.setCurrentRefreshToken(refreshTokenCookie.token, user.id);

    request.res?.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie.cookie]);
    return user;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('log-out')
  @HttpCode(200)
  async logOut(@Req() request: RequestWithUser) {
    await this.userService.removeRefreshToken(request.user.id);
    request.res?.setHeader('Set-Cookie', this.authenticationService.getCookiesForLogOut());
  }
  
  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() request: RequestWithUser) {
    const accessTokenCookie = this.authenticationService.getCookieWithJwtAccessToken(request.user.id);

    request.res?.setHeader('Set-Cookie', accessTokenCookie);
    return request.user;
  }
}