import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AuthCredentialsDto } from '../auth/dto/auth-credential.dto';
import { UserDocument, User } from './users.schemas';
import { Model } from 'mongoose';
import {
  IUser,
  IUserInfo,
  IUserRestorePwd,
} from './interfaces/users.interfaces';
import { v4 as uuidv4 } from 'uuid';
import { MailService } from '../mail/mail.service';
import { DatabaseService } from '../database/database.service';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly mailService: MailService,
    private readonly databaseService: DatabaseService,
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

  async resetPassword(originUrl: string, data: string): Promise<any> {
    const findUsers = await this.userModel.find({
      $or: [{ email: data }, { phone: data }],
    });

    if (!findUsers.length) {
      throw new NotFoundException();
    }
    const user = findUsers[0];
    try {
      const session = await this.userModel.startSession();
      session.startTransaction();
      user.verifyToken = uuidv4();
      user.verifyTokenExpAt = new Date(Date.now() + 3600 * 2 * 1000);

      await user.save();
      await this.mailService.sendUserConfirmation(
        originUrl,
        user,
        user.verifyToken,
      );
      await session.endSession();
      return { message: 'success' };
    } catch (error) {
      return { message: error.message };
    }
  }

  async getMyInfo(_id: string): Promise<IUserInfo> {
    await this.databaseService.executeQuery('SELECT * from user');
    return this.userModel.findById(_id);
  }

  async restorePassword(_id: string, token: string): Promise<IUserRestorePwd> {
    const checkUser = await this.userModel.findOne({ _id, verifyToken: token });

    if (!checkUser) {
      throw new NotFoundException();
    }
    if (new Date(checkUser.verifyTokenExpAt) < new Date()) {
      throw new RequestTimeoutException();
    }
    return checkUser;
  }

  async updatePassword(
    _id: string,
    token: string,
    newPassword: string,
  ): Promise<any> {
    try {
      const user = await this.userModel.findOne({ _id, verifyToken: token });
      if (!user) {
        throw new NotFoundException();
      }
      user.password = newPassword;
      user.verifyToken = '';
      user.verifyTokenExpAt = null;
      await user.save();
      return user;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
