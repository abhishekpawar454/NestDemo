import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { join } from 'path';
import ejs from 'ejs';

@Injectable()
export class EmailService {
  private readonly transporter: Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT'),
      secure: true,
      auth: {
        user: this.configService.get<string>('EMAIL_FROM'),
        pass: this.configService.get<string>('EMAIL_USER'),
      },
    });
  }

  async forgotPasswordMail(to: string, otp: number): Promise<void> {
    const from = this.configService.get<string>('EMAIL_FROM');
    const templatePath = join(
      process.cwd(),
      'src',
      'common',
      'views',
      'forgot-password.ejs',
    );
    const html = await ejs.renderFile(templatePath, { otp });
    try {
      await this.transporter.sendMail({
        from,
        to,
        subject: 'Forgot Password',
        html,
      });
      this.logger.log(`Email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}`, error.stack);
      throw error;
    }
  }
}
