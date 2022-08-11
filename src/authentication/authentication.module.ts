import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from '@nestjs/passport';

import { UserModule } from "../user/user.module";

import { AuthenticationController } from "./authentication.controller";
import { AuthenticationService } from './authentication.service';
import { JwtStrategy } from "./jwt.strategy";
import { LocalStrategy } from "./local.stategy";

@Module({
  controllers: [AuthenticationController],
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}s`,
        },
      }),
    }),
    PassportModule,
    UserModule,
  ],
  providers: [AuthenticationService, JwtStrategy, LocalStrategy],
})
export class AuthenticationModule {}