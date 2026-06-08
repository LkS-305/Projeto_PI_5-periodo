import nodemailer from 'nodemailer';
import { IMailProvider, IMessage } from '../../core/dtos/mail';
import { AppError } from '../../core/errors/AppError';

export class NodemailerMailProvider implements IMailProvider {
  private transporter: nodemailer.Transporter | null = null;
  private readonly fromHeader: string;

  constructor() {
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = Number(process.env.SMTP_PORT || 465);
    const secure =
      process.env.SMTP_SECURE !== 'false' && process.env.SMTP_SECURE !== '0';
    const user = (process.env.SMTP_USER || '').trim();
    const pass = (process.env.SMTP_PASS || '').trim();
    const fromRaw = (process.env.MAIL_FROM || user || 'noreply@localhost').trim();
    this.fromHeader =
      fromRaw.includes('<') && fromRaw.includes('>') ? fromRaw : `DOMI <${fromRaw}>`;

    if (user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass },
      });
    }
  }

  async sendMail(message: IMessage): Promise<void> {
    if (!this.transporter) {
      if (process.env.NODE_ENV === 'production') {
        throw new AppError(
          'Envio de e-mail não configurado. Defina SMTP_USER e SMTP_PASS (e, se quiser, SMTP_HOST, SMTP_PORT, SMTP_SECURE, MAIL_FROM).',
          503,
        );
      }
      console.warn('[MAIL] SMTP não configurado — simulando envio (desenvolvimento)');
      console.warn('[MAIL] Para:', message.to, '|', message.subject);
      const plain = message.body.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
      console.warn('[MAIL]', plain);
      return;
    }

    await this.transporter.sendMail({
      from: this.fromHeader,
      to: message.to,
      subject: message.subject,
      html: message.body,
    });
  }
}
