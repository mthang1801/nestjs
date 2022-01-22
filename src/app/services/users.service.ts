import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { MailService } from './mail.service';
import { UserRepository } from '../repositories/user.repository';
import { Table } from '../../database/enums/index';
import {
  convertToMySQLDateTime,
  preprocessUserResult,
} from '../../utils/helper';
import { Like } from '../../database/find-options/operators';
import * as bcrypt from 'bcrypt';
import { BaseService } from '../../base/base.service';
import { LoggerService } from '../../logger/custom.logger';
import { ObjectLiteral } from '../../common/ObjectLiteral';
import { UserProfileEntity } from '../entities/user-profile.entity';
import { PrimaryKeys } from '../../database/enums/primary-keys.enum';
import { saltHashPassword } from '../../utils/cipherHelper';
import { UserProfilesService } from '../services/user-profiles.service';
import { rejects } from 'assert';
@Injectable()
export class UsersService extends BaseService<
  UserEntity,
  UserRepository<UserEntity>
> {
  protected userRepository: UserRepository<UserEntity>;
  constructor(
    private readonly mailService: MailService,
    private readonly userProfileService: UserProfilesService,
    repository: UserRepository<UserEntity>,

    logger: LoggerService,
    table: Table,
  ) {
    super(repository, logger, table);
    this.userRepository = repository;
    this.table = Table.USERS;
  }

  async createUser(registerData): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const checkUserExists = await this.userRepository.findOne({
          where: [{ email: registerData.email }, { phone: registerData.phone }],
        });
        if (checkUserExists) {
          return reject(
            this.optionalResponse(
              200,
              'Địa chỉ email hoặc số điện thoại đã được đăng ký.',
            ),
          );
        }
        let user = await this.userRepository.create(registerData);
        await this.userProfileService.createUserProfile(user);

        resolve(this.responseSuccess({ user }));
      } catch (error) {
        reject(error);
      }
    });
  }

  // async create(dataObj: ObjectLiteral): Promise<UserEntity> {
  //   let user = await this.userRepository.create(dataObj);
  //   return user;
  // }

  // async findById(id: number): Promise<UserEntity> {
  //   const user = await this.userRepository.findById(id);

  //   return user;
  // }

  async updateUser(
    user_id: number,
    dataObj: ObjectLiteral,
  ): Promise<UserEntity> {
    return new Promise(async (resolve, reject) => {
      try {
        const updatedUser = await this.userRepository.update(user_id, dataObj);

        resolve(updatedUser);
      } catch (error) {
        reject(error);
      }
    });
  }

  async findOne(dataObj: ObjectLiteral | ObjectLiteral[]): Promise<any> {
    try {
      const user = await this.userRepository.findOne({ where: dataObj });

      return user;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async resetPasswordByEmail(
    originUrl: string,
    email: string,
  ): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        const user: any = await this.userRepository.findOne({
          where: { email },
        });
        if (!user) {
          return reject(this.errorNotFound('Địa chỉ email không tồn tại.'));
        }

        const verifyToken = uuidv4();

        const updatedUser = await this.userRepository.update(user.user_id, {
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
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }

  async getMyInfo(id: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.userRepository.findOne({
          where: { [PrimaryKeys[this.table]]: id },
        });

        if (!user) {
          return reject(this.errorNotFound('Người dùng không tồn tại.'));
        }

        resolve(this.responseSuccess({ userData: preprocessUserResult(user) }));
      } catch (error) {
        reject(error);
      }
    });
  }

  async renderForgotPasswordByEmail(
    user_id: string,
    token: string,
  ): Promise<UserEntity> {
    return new Promise(async (resolve, reject) => {
      try {
        const checkUser: any = await this.userRepository.findOne({
          where: { user_id, verify_token: token },
        });
        if (!checkUser) {
          return reject(this.errorNotFound('User_id và token không đúng'));
        }

        if (
          convertToMySQLDateTime(new Date(checkUser.verify_token_exp)) <
          convertToMySQLDateTime(new Date())
        ) {
          return reject(this.optionalResponse(200, 'Token đã hết hạn.'));
        }
        resolve(checkUser);
      } catch (error) {
        reject(error);
      }
    });
  }

  async updatePasswordByEmail(
    user_id: number,
    token: string,
    newPassword: string,
  ): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        const user: any = await this.userRepository.findOne({
          where: {
            user_id,
            verify_token: token,
          },
        });

        if (
          convertToMySQLDateTime(user.verify_token_exp) <
          convertToMySQLDateTime(new Date())
        ) {
          return reject(
            this.optionalResponse(
              200,
              "'Token đã hết hiệu lực, cập nhật thất bại.'",
            ),
          );
        }
        if (!user) {
          return reject(this.errorNotFound('Không tìm thấy người dùng.'));
        }
        const { passwordHash, salt } = saltHashPassword(newPassword);

        await this.userRepository.update(user_id, {
          password: passwordHash,
          salt,
          verify_token: '',
        });
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }

  // async updateUserOTP(user_id: number, otp: number): Promise<UserEntity> {
  //   const updatedUser = this.userRepository.update(user_id, {
  //     otp,
  //     otp_incorrect_times: 0,
  //   });
  //   return updatedUser;
  // }

  // async restorePasswordByOTP(user_id: number, otp: number): Promise<boolean> {
  //   try {
  //     const user = await this.userRepository.findById(user_id);

  //     if (user.otp_incorrect_times > 2) {
  //       throw new BadRequestException({
  //         message: 'Số lần nhập mã OTP vượt quá giới hạn',
  //       });
  //     }
  //     if (user.otp !== otp) {
  //       const otp_incorrect_times = user.otp_incorrect_times + 1;
  //       await this.userRepository.update(user.user_id, {
  //         otp_incorrect_times,
  //       });

  //       throw new BadRequestException({ message: 'OTP không chính xác' });
  //     }
  //     return true;
  //   } catch (error) {
  //     throw new InternalServerErrorException(error);
  //   }
  // }
}
