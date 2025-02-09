import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { ChatsService } from './chats.service';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post('broadcast/message')
  async sendMessageByNumbers(
    @Body('numbers') numbers: string[],
    @Body('message') message: string,
  ) {
    await this.chatsService.sendMessageByNumbers(numbers, message);
    return { message: 'Messages sent' };
  }

  @Post(':number/message')
  async sendMessageByNumber(
    @Param('number') number: string,
    @Body('message') message: string,
  ) {
    const data = await this.chatsService.sendMessageByNumber(number, message);
    return { message: 'Message sent', data };
  }

  @Get(':number')
  async getChatByNumber(@Param('number') number: string) {
    const id = await this.chatsService.getChatIdByNumber(number);
    return { data: id };
  }
}
