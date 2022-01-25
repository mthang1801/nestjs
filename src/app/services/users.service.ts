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
import {
  UserRepository,
  UserProfileRepository,
} from '../repositories/user.repository';
import { Table } from '../../database/enums/index';
import {
  convertToMySQLDateTime,
  preprocessUserResult,
} from '../../utils/helper';
import { BaseService } from '../../base/base.service';
import { ObjectLiteral } from '../../common/ObjectLiteral';
import { UserProfileEntity } from '../entities/user.entity';
import { PrimaryKeys } from '../../database/enums/primary-keys.enum';
import { saltHashPassword } from '../../utils/cipherHelper';
import { UserProfilesService } from './user_profiles.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { JoinTable } from '../../database/enums/joinTable.enum';
import { UserProfileDto } from '../dto/user/update-user-profile.dto';
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
    table: Table,
    private userProfileRepository: UserProfileRepository<UserProfileEntity>,
  ) {
    super(repository, table);
    this.userRepository = repository;
    this.table = Table.USERS;
  }

  async createUser(registerData): Promise<UserEntity> {
    const checkUserExists = await this.userRepository.findOne({
      where: [{ email: registerData.email }, { phone: registerData.phone }],
    });

    if (
      (typeof checkUserExists === 'object' &&
        Object.entries(checkUserExists).length) ||
      (typeof checkUserExists !== 'object' && checkUserExists)
    ) {
      throw new HttpException(
        'Địa chỉ email hoặc số điện thoại đã được đăng ký.',
        HttpStatus.BAD_REQUEST,
      );
    }
    let user = await this.userRepository.create(registerData);
    await this.userProfileService.createUserProfile(user);
    return user;
  }

  async create(dataObj: ObjectLiteral): Promise<UserEntity> {
    let user = await this.userRepository.create(dataObj);
    return user;
  }

  async findById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new HttpException(
        'Không tìm thấy người dùng.',
        HttpStatus.NOT_FOUND,
      );
    }
    return preprocessUserResult(user);
  }

  async updateUser(
    user_id: number,
    dataObj: ObjectLiteral,
  ): Promise<UserEntity> {
    const updatedUser = await this.userRepository.update(user_id, dataObj);
    console.log(updatedUser);
    return preprocessUserResult(updatedUser);
  }

  async findOne(dataObj: ObjectLiteral | ObjectLiteral[]): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: dataObj });
    return user;
  }

  async resetPasswordByEmail(
    originUrl: string,
    email: string,
  ): Promise<boolean> {
    const user: any = await this.userRepository.findOne({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException();
    }

    try {
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
      return true;
    } catch (error) {
      throw new InternalServerErrorException({ message: error.message });
    }
  }

  async getMyInfo(id: string): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findOne({
        select: ['*'],
        join: {
          [JoinTable.leftJoin]: {
            [Table.USER_PROFILES]: {
              fieldJoin: `${Table.USER_PROFILES}.user_id`,
              rootJoin: `${this.table}.user_id`,
            },
          },
        },
        where: { [`${this.table}.${PrimaryKeys[this.table]}`]: id },
      });

      return preprocessUserResult(user);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async restorePasswordByEmail(
    user_id: string,
    token: string,
  ): Promise<UserEntity> {
    const checkUser: any = await this.userRepository.findOne({
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
      const user: any = await this.userRepository.findOne({
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

      await this.userRepository.update(user_id, {
        password: passwordHash,
        salt,
        verify_token: '',
      });
      return true;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async updateUserOTP(user_id: number, otp: number): Promise<UserEntity> {
    const updatedUser = this.userRepository.update(user_id, {
      otp,
      otp_incorrect_times: 0,
    });
    return updatedUser;
  }

  async restorePasswordByOTP(user_id: number, otp: number): Promise<boolean> {
    const user = await this.userRepository.findById(user_id);

    if (user.otp_incorrect_times > 2) {
      throw new BadRequestException({
        message: 'Số lần nhập mã OTP vượt quá giới hạn',
      });
    }
    if (user.otp !== otp) {
      const otp_incorrect_times = user.otp_incorrect_times + 1;
      await this.userRepository.update(user.user_id, {
        otp_incorrect_times,
      });

      throw new BadRequestException({ message: 'OTP không chính xác' });
    }
    return true;
  }

  async updateProfile(
    id: number,
    userProfileDto: UserProfileDto,
  ): Promise<UserProfileEntity> {
    const updatedProfile = await this.userProfileRepository.update(
      id,
      userProfileDto,
    );
    return updatedProfile;
  }
}
