import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { User } from '../entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { MailService } from './mail.service';
import { UserRepository } from '../repositories/user.repository';
import { Table } from '../../database/enums/index';
import { convertToMySQLDateTime } from '../../utils/helper';
import { Like } from '../../database/find-options/operators';
import * as bcrypt from 'bcrypt';
import { BaseService } from '../../base/base.service';
import { LoggerService } from '../../logger/custom.logger';
import { ObjectLiteral } from '../../common/ObjectLiteral';
import { AuthProviderEnum } from '../helpers/enums/auth-provider.enum';
import { PrimaryKeys } from '../../database/enums/primary-keys.enum';
import { UserAuthSocialMedia } from '../interfaces/users.interface';
import { saltHashPassword } from '../../utils/cipherHelper';
@Injectable()
export class UsersService extends BaseService<User, UserRepository<User>> {
  constructor(
    private readonly mailService: MailService,
    repository: UserRepository<User>,
    logger: LoggerService,
    table: Table,
  ) {
    super(repository, logger, table);
    this.table = Table.USERS;
  }

  async createUser(registerData): Promise<User> {
    try {
      const checkUserExists = await this.repository.findOne({
        where: [{ email: registerData.email }, { phone: registerData.phone }],
      });
      if (checkUserExists) {
        throw new BadRequestException({
          message: 'Địa chỉ email hoặc số điện thoại đã được đăng ký.',
        });
      }
      let user = await this.repository.create(registerData);

      return user;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async create(dataObj: ObjectLiteral): Promise<User> {
    let user = await this.repository.create(dataObj);
    return user;
  }

  async findById(id: number): Promise<User> {
    const user = await this.repository.findById(id);

    return user;
  }

  async updateUserInfo(user_id: number, dataObj: ObjectLiteral): Promise<User> {
    const updatedUser = await this.repository.update(user_id, dataObj);

    return updatedUser;
  }

  async findOne(dataObj: ObjectLiteral | ObjectLiteral[]): Promise<User> {
    try {
      const user = await this.repository.findOne({ where: dataObj });
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async resetPasswordByEmail(
    originUrl: string,
    email: string,
  ): Promise<boolean> {
    const user: any = await this.repository.findOne({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException();
    }

    try {
      const verifyToken = uuidv4();

      const updatedUser = await this.repository.update(user.user_id, {
        verify_token: verifyToken,
        verify_token_exp: convertToMySQLDateTime(
          new Date(Date.now() + 2 * 3600 * 1000),
        ),
      });

      await this.mailService.sendUserConfirmation(
        originUrl,
        updatedUser,
        verifyToken,
      );
      return true;
    } catch (error) {
      throw new InternalServerErrorException({ message: error.message });
    }
  }

  async getMyInfo(id: string): Promise<User> {
    try {
      const user = await this.repository.findOne({
        where: { [PrimaryKeys[this.table]]: id },
      });

      // const test = await this.repository.find({
      //   select: ['*'],
      //   join: {
      //     alias: 'user',
      //     [JoinTable.leftJoin]: {
      //       orders: { fieldJoin: 'customer_id', rootJoin: 'id' },
      //       orderItem: {
      //         fieldJoin: 'orderItem.orderId',
      //         rootJoin: 'orders.order_id',
      //       },
      //       products: {
      //         fieldJoin: 'products.product_id',
      //         rootJoin: 'orderItem.productId',
      //       },
      //     },
      //   },
      //   where: [
      //     { firstName: Like('Mai văn'), lastName: 'Quốc' },
      //     { firstName: [Like('Mai'), 'Nguyễn'], lastName: 'Bê' },
      //     { firstName: 'Mai văn', lastName: 'Thắng' },
      //     { firstName: 'Quang' },
      //   ],
      //   // where: {
      //   //   firstName: [Like('Mai'), 'Nguyễn'],
      //   //   lastName: Like('Thắng'),
      //   //   country: Like('VietNam'),
      //   //   email: 'mthang1801@gmail.com',
      //   // },
      //   orderBy: [
      //     { field: 'orderItem.id', sort_by: SortBy.ASC },
      //     { field: 'product.price', sort_by: SortBy.DESC },
      //     { field: 'product.id', sort_by: SortBy.ASC },
      //     { field: 'product.quantity', sort_by: SortBy.DESC },
      //   ],
      //   skip: 0,
      //   limit: 30,
      // });
      // console.log(test);

      return user;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async restorePasswordByEmail(user_id: string, token: string): Promise<User> {
    const checkUser: any = await this.repository.findOne({
      where: { user_id, verify_token: token },
    });

    if (!checkUser) {
      throw new NotFoundException();
    }

    if (
      new Date(
        new Date(checkUser.verify_token_exp).getTime() * 7 * 3600 * 1000,
      ) < new Date()
    ) {
      throw new RequestTimeoutException({
        status_code: 400,
        message: 'Token đã hết hạn.',
      });
    }
    return checkUser;
  }

  async updatePasswordByEmail(
    user_id: number,
    token: string,
    newPassword: string,
  ): Promise<boolean> {
    try {
      const user: any = await this.repository.findOne({
        where: {
          user_id,
          verify_token: token,
        },
      });

      if (new Date(user.verify_token_exp) < new Date()) {
        throw new RequestTimeoutException({
          message: 'Token đã hết hiệu lực, cập nhật thất bại.',
        });
      }

      if (!user) {
        throw new NotFoundException();
      }
      const { passwordHash, salt } = saltHashPassword(newPassword);

      await this.repository.update(user_id, {
        password: passwordHash,
        salt,
        verify_token: '',
      });
      return true;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async updateUserOTP(user_id: number, otp: number): Promise<User> {
    const updatedUser = this.repository.update(user_id, { otp });
    return updatedUser;
  }

  async updateUserOTPExpiration(user_id): Promise<boolean> {
    const dateExp = new Date(new Date().getTime() + 15 * 1000 * 60);
    const otp_exp = convertToMySQLDateTime(dateExp);
    this.repository.update(user_id, { otp_exp });
    return true;
  }
}
