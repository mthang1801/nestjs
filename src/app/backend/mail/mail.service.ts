import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { IUserConfirm } from '../users/interfaces/users.interfaces';
import { join } from 'path';
@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(
    originUrl: string,
    user: IUserConfirm,
    token: string,
  ) {
    const url = `${originUrl}/auth/restore-password?token=${token}&_id=${user.id}`;

    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Xác nhận khôi phục tài khoản',
      template: 'confirmation', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        name: user.displayName,
        url,
      },
    });
  }
}
