import { join } from "path";

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

import SubscriberController from './subscriber.controller';

@Module({
  controllers: [SubscriberController],
  imports: [ConfigModule],
  providers: [
    {
      inject: [ConfigService],
      provide: 'SUBSCRIBERS_PACKAGE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          options: {
            package: 'subscribers',
            protoPath: join(process.cwd(), 'src/subscribers/subscribers.proto'),
            url: configService.get('GRPC_CONNECTION_URL')
          },
          transport: Transport.GRPC,
        })
      },
    }
  ],
})
export class SubscriberModule {}