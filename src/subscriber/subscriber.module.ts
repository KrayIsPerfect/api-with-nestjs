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
      provide: 'SUBSCRIBERS_SERVICE',
      useFactory: (configService: ConfigService) => {
        const user = configService.get('RABBITMQ_USER');
        const password = configService.get('RABBITMQ_PASSWORD');
        const host = configService.get('RABBITMQ_HOST');
        const queueName = configService.get('RABBITMQ_QUEUE_NAME');

        return ClientProxyFactory.create({
          options: {
            queue: queueName,
            queueOptions: {
              durable: true,
            },
            urls: [`amqp://${user}:${password}@${host}`],
          },
          transport: Transport.RMQ,
        })
      },
    }
  ],
})
export class SubscriberModule {}