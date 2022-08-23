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
      provide: 'SUBSCRIBER_SERVICE',
      useFactory: (configService: ConfigService) => (
        ClientProxyFactory.create({
          options: {
            host: configService.get('SUBSCRIBER_SERVICE_HOST'),
            port: configService.get('SUBSCRIBER_SERVICE_PORT'),
          },
          transport: Transport.TCP,
        })
      ),
    }
  ],
})
export class SubscriberModule {}