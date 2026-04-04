import nodemailer from 'nodemailer';
import { IMailProvider, IMessage } from '../../core/dtos/mail';

export class NodemailerMailProvider implements IMailProvider {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // Ou o serviço que preferir
      port: 465,
      secure: true,
      auth: {
        user: "seu-email@gmail.com",
        pass: "sua-senha-de-app"
      }
    });
  }

  async sendMail(message: IMessage): Promise<void> {
    await this.transporter.sendMail({
      from: 'Projeto PI <seu-email@gmail.com>',
      to: message.to,
      subject: message.subject,
      html: message.body, // Enviando como HTML para ficar bonito
    });
  }
}
