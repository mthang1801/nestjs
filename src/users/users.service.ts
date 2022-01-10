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
import { Table } from '../database/enums/tables.enum';
import { DatabaseRepository } from '../database/database.repository';
import { Operator } from '../database/enums/operator.enum';
import { convertDateToTimeStamp } from '../utils/helper';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly mailService: MailService,
    private readonly baseRepository: DatabaseRepository,
  ) {}

  async createUser(
    displayName: string,
    email: string,
    password: string,
    phone: string,
  ): Promise<any> {
    try {
      const user = await this.baseRepository.insert(
        { displayName, email, password, phone },
        Table.USER,
      );
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async findOne(username: string): Promise<any> {
    try {
      const user = await this.baseRepository.findOne(
        [{ email: username }],
        [],
        Table.USER,
      );
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async resetPassword(originUrl: string, data: string): Promise<any> {
    const user: any = await this.baseRepository.findOne(
      [{ email: data }, { phone: data }],
      [],
      Table.USER,
      [Operator.OR],
    );
    if (!user) {
      throw new NotFoundException();
    }

    try {
      const verifyToken = uuidv4();

      await this.baseRepository.update(
        [{ id: user.id }],
        [
          { verifyToken },
          {
            verifyTokenExpAt: convertDateToTimeStamp(
              new Date(Date.now() + 3600 * 9 * 1000),
            ),
          },
        ],
        Table.USER,
        [],
      );
      await this.mailService.sendUserConfirmation(originUrl, user, verifyToken);

      return { message: 'success' };
    } catch (error) {
      return { message: error.message };
    }
  }

  async getMyInfo(id: string): Promise<any> {
    try {
      const user = await this.baseRepository.findOne([{ id }], [], Table.USER);
      const userObject = JSON.parse(JSON.stringify(user));
      delete userObject.password;
      return userObject;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async restorePassword(id: string, token: string): Promise<any> {
    const checkUser: any = await this.baseRepository.findOne(
      [{ id, verifyToken: token }],
      [],
      Table.USER,
    );

    if (!checkUser) {
      throw new NotFoundException();
    }
    if (
      new Date(checkUser.verifyTokenExpAt) < new Date(new Date().toISOString())
    ) {
      throw new RequestTimeoutException();
    }
  }

  async updatePassword(
    _id: number,
    token: string,
    newPassword: string,
  ): Promise<any> {
    try {
      const user: any = await this.baseRepository.findOne(
        [
          {
            id: +_id,
            verifyToken: token,
          },
        ],
        [],
        Table.USER,
      );
      if (!user) {
        throw new NotFoundException();
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.baseRepository.update(
        [{ id: user.id }],
        [
          {
            password: hashedPassword,
            updatedAt: convertDateToTimeStamp(new Date()),
          },
        ],
        Table.USER,
        [],
      );
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
