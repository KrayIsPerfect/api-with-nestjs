import {
  Body,
  Controller, Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards
} from "@nestjs/common";
import { Response } from "express";

import RegisterDto from "./dto/register.dto";
import { AuthenticationService } from "./authentication.service";
import JwtAuthenticationGuard from "./jwt.authentication.guard";
import { LocalAuthenticationGuard } from "./local.authentication.guard";
import RequestWithUser from "./request.with.user.interface";

@Controller()
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService
  ) {
  }

  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    return this.authenticationService.register(registrationData);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    const user = request.user;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    user.password = undefined;
    return user;
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post("log-in")
  async logIn(@Req() request: RequestWithUser, @Res() response: Response) {
    const { user } = request;
    const cookie = this.authenticationService.getCookieWithJwtToken(user.id);
    response.setHeader("Set-Cookie", cookie);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    user.password = undefined;
    return response.send(user);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post("log-out")
  async logOut(@Req() request: RequestWithUser, @Res() response: Response) {
    response.setHeader("Set-Cookie", this.authenticationService.getCookieForLogOut());
    return response.sendStatus(200);
  }
}