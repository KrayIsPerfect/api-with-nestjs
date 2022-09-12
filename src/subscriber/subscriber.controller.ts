import {
  Body,
  ClassSerializerInterceptor,   Controller,
  Get,
Inject,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

import JwtAuthenticationGuard from '../authentication/jwt.authentication.guard';

import CreateSubscriberDto from './dto/create.subscriber.dto';
import SubscriberService from './subscriber.service.interface';

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export default class SubscriberController {
  private subscriberService: SubscriberService;

  constructor(@Inject('SUBSCRIBERS_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.subscriberService = this.client.getService<SubscriberService>('SubscriberService');
  }

  @Get()
  async getSubscribers() {
    return this.subscriberService.getAllSubscribers({});
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async createPost(@Body() subscriber: CreateSubscriberDto) {
    return this.subscriberService.addSubscriber(subscriber);
  }
}