import {
  Body,
  ClassSerializerInterceptor,   Controller,
  Get,
Inject,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import JwtAuthenticationGuard from '../authentication/jwt.authentication.guard';

import CreateSubscriberDto from './dto/create.subscriber.dto';

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export default class SubscriberController {
  constructor(
    @Inject('SUBSCRIBER_SERVICE') private subscriberService: ClientProxy,
  ) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  async getSubscribers() {
    return this.subscriberService.send({
      cmd: 'get-all-subscribers'
    }, '')
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async createPost(@Body() subscriber: CreateSubscriberDto) {
    return this.subscriberService.emit({
      cmd: 'add-subscriber'
    }, subscriber)
  }
}