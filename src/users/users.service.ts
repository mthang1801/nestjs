import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AuthCredentialsDto } from '../auth/dto/auth-credential.dto';
import { UserDocument, User } from './users.schemas';
import { Model } from 'mongoose';
import { IUser, IUserInfo } from './interfaces/users.interfaces';
import { v4 as uuidv4 } from 'uuid';

import { MailerService } from '@nestjs-modules/mailer';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly mailerService: MailerService,
  ) {}

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<IUser> {
    const user = await new this.userModel({
      ...authCredentialsDto,
    }).save();
    return user;
  }
  async findOne(username: string): Promise<IUser> {
    return this.userModel.findOne({ username });
  }

  async resetPassword(email: string, phone: string): Promise<void> {
    console.log(email, phone);
    const user = await this.userModel.findOne({ email, phone });
    if (!user) {
      throw new NotFoundException();
    }
    const session = await this.userModel.startSession();
    session.startTransaction();
    user.verifyToken = uuidv4();
    user.verifyTokenExpAt = new Date(Date.now() + 3600 * 2 * 1000);
    await user.save();
    const result = await this.mailerService.sendMail({
      to: `${user.email}`, // List of receivers email address
      from: 'admin@ddevcom.com', // Senders email address
      subject: 'Xác nhận yêu cầu khôi phục mật khẩu',
      template: 'reset-password.mailer', // The `.pug` or `.hbs` extension is appended automatically.
      context: {
        // Data to be sent to template engine.
        code: 'cf1a3f828287',
        username: 'john doe',
      },
    });
    await session.endSession();
  }

  async getMyInfo(_id: string): Promise<IUserInfo> {
    return this.userModel.findById(_id);
  }
}
