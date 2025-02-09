import { Module } from '@nestjs/common';
import { ChatsModule } from './chats/chats.module';
import { WhatsappService } from './whatsapp/whatsapp.service';
import { WhatsappModule } from './whatsapp/whatsapp.module';

@Module({
  imports: [ChatsModule, WhatsappModule],
  providers: [WhatsappService],
})
export class AppModule {}
