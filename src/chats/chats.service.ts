import { Injectable } from '@nestjs/common';
import { WhatsappService } from '../whatsapp/whatsapp.service';

@Injectable()
export class ChatsService {
  constructor(private readonly whatsAppService: WhatsappService) {}

  /**
   * Enviar un mensaje a un chat específico
   * @param number Número de teléfono con código de país y área
   * @param message Contenido del mensaje
   */
  async sendMessageByNumber(number: string, message: string) {
    if (!message) throw new Error('El mensaje debe ser válido.');

    const chat = await this.whatsAppService.getNumberId(number);
    if (!chat) throw new Error('El número no está registrado en WhatsApp.');

    return await this.whatsAppService.sendMessage(chat._serialized, message);
  }

  /**
   * Enviar un mensaje a un chat específico
   * @param number Número de teléfono con código de país y área
   * @param message Contenido del mensaje
   */
  async sendMessageByNumbers(numbers: string[], message: string) {
    if (!message) throw new Error('El mensaje debe ser válido.');

    for (const number of numbers) {
      await this.sendMessageByNumber(number, message);
    }
  }

  /**
   * Obtener el chat ID a partir de un número de teléfono
   * @param number Número de teléfono con código de país
   */
  async getChatIdByNumber(number: string) {
    const chat = await this.whatsAppService.getNumberId(number);
    return chat ? chat._serialized : null;
  }

  /**
   * Obtener la lista de chats abiertos
   */
  async getAllChats() {
    return await this.whatsAppService.getChats();
  }

  /**
   * Obtener los mensajes de un chat específico
   * @param chatId ID del chat
   */
  async getMessagesByChat(chatId: string) {
    const chat = await this.whatsAppService.getChatById(chatId);
    return await chat.fetchMessages({ limit: 20 }); // Últimos 20 mensajes
  }

  /**
   * Marcar un chat como leído
   * @param chatId ID del chat
   */
  async markChatAsRead(chatId: string) {
    const chat = await this.whatsAppService.getChatById(chatId);
    await chat.sendSeen();
    return true;
  }
}
