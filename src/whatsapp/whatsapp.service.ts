import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, LocalAuth } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';

@Injectable()
export class WhatsappService implements OnModuleInit {
  private client: Client;

  constructor() {
    this.client = new Client({
      authStrategy: new LocalAuth({
        dataPath: './whatsapp-sessions',
      }),
      puppeteer: {
        headless: true, // Ejecuta en modo headless
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
    });

    // Evento para generar QR
    this.client.on('qr', (qr) => {
      console.log('Escanea el código QR con tu teléfono');
      qrcode.generate(qr, { small: true });
    });

    // Evento cuando el cliente está listo
    this.client.on('ready', () => {
      console.log('Cliente de WhatsApp listo!');
    });

    // Evento para recibir mensajes
    this.client.on('message', async (message) => {
      console.log(`Mensaje recibido de ${message.from}: ${message.body}`);

      if (message.body.toLowerCase() === 'hola') {
        await message.reply('¡Hola! ¿En qué puedo ayudarte?');
      }
    });

    // Manejo de errores
    this.client.on('auth_failure', (msg) => {
      console.error(`Error de autenticación: ${msg}`);
    });

    this.client.on('disconnected', (reason) => {
      console.warn(`Cliente desconectado: ${reason}`);
    });
  }

  onModuleInit() {
    this.client.initialize();
  }

  async sendMessage(to: string, message: string): Promise<void> {
    await this.client.sendMessage(to, message);
  }

  async getNumberId(number: string) {
    return await this.client.getNumberId(number);
  }

  async getChatById(chatId: string) {
    return await this.client.getChatById(chatId);
  }

  async getChats() {
    return await this.client.getChats();
  }
}
