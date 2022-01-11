import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { IUser } from './interfaces/users.interfaces';
import { v4 as uuidv4 } from 'uuid';
import { MailService } from '../mail/mail.service';
import { Table } from '../database/enums/tables.enum';
import { UserRepository } from './user.repository';
import { Operator } from '../database/enums/operator.enum';
import { convertDateToTimeStamp } from '../utils/helper';
import * as bcrypt from 'bcrypt';
import { BaseService } from '../base/base.service';
import { LoggerService } from '../logger/custom.logger';
@Injectable()
export class UsersService extends BaseService<IUser, UserRepository<IUser>> {
  constructor(
    private readonly mailService: MailService,
    repository: UserRepository<IUser>,
    logger: LoggerService,
  ) {
    super(repository, logger);
  }

  async createUser(
    displayName: string,
    email: string,
    password: string,
    phone: string,
  ): Promise<IUser | any> {
    try {
      const user = await this.repository.insert(
        { displayName, email, password, phone },
        Table.USER,
      );
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async findOne(username: string): Promise<IUser | any> {
    try {
      const user = await this.repository.findOne(
        [{ email: username }],
        [],
        Table.USER,
      );
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async resetPassword(originUrl: string, data: string): Promise<IUser | any> {
    const user: any = await this.repository.findOne(
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

      await this.repository.update(
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

  async getMyInfo(id: string): Promise<IUser | any> {
    try {
      const user = await this.repository.findOne([{ id }], [], Table.USER);
      const userObject = JSON.parse(JSON.stringify(user));
      delete userObject.password;
      return userObject;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async restorePassword(id: string, token: string): Promise<any> {
    const checkUser: any = await this.repository.findOne(
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
      const user: any = await this.repository.findOne(
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
      await this.repository.update(
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
