import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { join } from 'path';
import { PrimaryKeys } from '../../database/enums/index';
@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(
    originUrl: string,
    user: User,
    token: string,
  ): Promise<void> {
    const prefixApi = process.env.PREFIX_API_BE;
    const url = join(
      originUrl,
      prefixApi,
      'auth',
      `restore-password?token=${token}&${PrimaryKeys.ddv_users}=${
        user[PrimaryKeys.ddv_users]
      }`,
    );
    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Xác nhận khôi phục tài khoản',
      template: 'confirmation', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        name: user.firstname + ' ' + user.lastname,
        url,
      },
    });
  }
}
