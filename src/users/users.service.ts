import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { User } from './user.entity';
import { v4 as uuidv4 } from 'uuid';
import { MailService } from '../mail/mail.service';
import { Table } from '../database/enums/tables.enum';
import { UserRepository } from './user.repository';
import { Operator } from '../database/enums/operator.enum';
import { convertDateToTimeStamp } from '../utils/helper';
import * as bcrypt from 'bcrypt';
import { BaseService } from '../base/base.service';
import { LoggerService } from '../logger/custom.logger';
import { ObjectLiteral } from '../common/ObjectLiteral';
import { AuthProvider } from '../auth/interfaces/provider.interface';
import {
  UserAuthGoogle,
  NewUserAuthGoogle,
} from './interfaces/users.interfaces';
@Injectable()
export class UsersService extends BaseService<User, UserRepository<User>> {
  constructor(
    private readonly mailService: MailService,
    repository: UserRepository<User>,
    logger: LoggerService,
  ) {
    super(repository, logger);
    this.table = Table.USERS;
  }

  async createUser(
    displayName: string,
    email: string,
    password: string,
    phone: string,
  ): Promise<User> {
    try {
      const user = await this.repository.insert(
        { displayName, email, password, phone },
        this.table,
      );
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async loginWithGoogle(user: UserAuthGoogle): Promise<User> {
    // 1. Tạo một google_access để lưu giữ refresh token và access_token,
    // 2. Đối với table User
    // TH1 : Nếu người dùng chưa có tài khoản -> tạo mới tài khoản ->
    //    i.  Gán id của google_access ở B1 vào google_access_id của User sắp khởi tạo
    //    ii. Truyền profile và avatar vào cho user
    //    iii. Vì password và phone là bắt buộc nhưng do tài khoản là google nên có 2 cách giải quyết
    ///       C1 : Gán mặc định một password random, phone mặc định là '0'
    ///       C2 : Tạo frontend stepper cho buộc người dùng nhập thêm thông tin, nhưng password không bắt buộc nên vẫn là random
    // TH2 : Nếu người dùng đã có tài khoản SYSTEM ->
    //    i. Gán id của google_access ở B1 vào google_access_id của User sắp khởi tạo
    //    ii. Đối với những fields profile nào người dùng để trống, đưa profile của google vào, ngược lại bỏ qua

    let userExist: User = await this.findOne({ email: user.email });
    const googleAccess = {
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
    };
    const googleAccessRes = await this.repository.insert(
      googleAccess,
      Table.GOOGLE_ACCESS,
    );
    if (!user.accessToken || !user.refreshToken) {
      throw new InternalServerErrorException({
        message: 'Not found access token or refresh token',
      });
    }
    if (!userExist) {
      const newUser = {
        google_access_id: googleAccessRes.id,
        displayName: user.displayName,
        firstName: user.givenName,
        lastName: user.familyName,
        avatar: user.avatar,
        email: user.email,
        provider: AuthProvider.GOOGLE,
        password: uuidv4(),
        phone: '0',
      };
      const newUserRes = await this.repository.insert(newUser, this.table);
      return newUserRes;
    }

    const updatedUser = {
      google_access_id: googleAccessRes.id,
      displayName: userExist.displayName || user.displayName,
      firstName: userExist.firstName || user.givenName,
      lastName: userExist.lastName || user.familyName,
      avatar: userExist.avatar || user.avatar,
      provider: AuthProvider.GOOGLE,
      password: userExist.password || uuidv4(),
      phone: userExist.phone || '0',
      updatedAt: convertDateToTimeStamp(new Date()),
    };

    await this.repository.update([{ id: userExist.id }], this.table, [
      updatedUser,
    ]);
    return userExist;
  }

  async findById(id: number): Promise<User> {
    const user = await this.repository.findById(id, this.table);
    const userObject = JSON.parse(JSON.stringify(user));
    delete userObject.password;
    return userObject;
  }

  async updateUserInfo(id: number, dataObj: ObjectLiteral): Promise<void> {
    await this.repository.update([{ id }], this.table, [dataObj]);
  }

  async findOne(dataObj: ObjectLiteral): Promise<User> {
    try {
      const user = await this.repository.findOne([dataObj], this.table);
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async resetPassword(originUrl: string, data: string): Promise<boolean> {
    const user: any = await this.repository.findOne(
      [{ email: data }, { phone: data }],
      this.table,
      [],
      [Operator.OR],
    );
    if (!user) {
      throw new NotFoundException();
    }

    try {
      const verifyToken = uuidv4();

      await this.repository.update([{ id: user.id }], this.table, [
        { verifyToken },
        {
          verifyTokenExpAt: convertDateToTimeStamp(
            new Date(Date.now() + 2 * 3600 * 1000),
          ),
        },
      ]);
      await this.mailService.sendUserConfirmation(originUrl, user, verifyToken);
      return true;
    } catch (error) {
      throw new InternalServerErrorException({ message: error.message });
    }
  }

  async getMyInfo(id: string): Promise<User> {
    try {
      const user = await this.repository.findOne([{ id }], this.table);
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
      this.table,
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
  ): Promise<boolean> {
    try {
      const user: any = await this.repository.findOne(
        [
          {
            id: +_id,
            verifyToken: token,
          },
        ],
        this.table,
      );
      if (!user) {
        throw new NotFoundException();
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.repository.update([{ id: user.id }], this.table, [
        {
          password: hashedPassword,
          updatedAt: convertDateToTimeStamp(new Date()),
        },
      ]);
      return true;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
