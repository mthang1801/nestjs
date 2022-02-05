import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  RequestTimeoutException,
  Inject,
} from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { Cache } from 'cache-manager';
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
import {
  ImagesLinksRepository,
  ImagesRepository,
} from '../repositories/image.repository';
import { ImagesLinksEntity, ImagesEntity } from '../entities/image.entity';
import { ImageObjectType } from '../helpers/enums/image_types.enum';
import { AuthProviderEntity } from '../entities/auth-provider.entity';
import { CacheService } from './cache.service';
import { TasksService } from './tasks.service';

@Injectable()
export class UsersService {
  private table: Table = Table.USERS;
  constructor(
    private readonly mailService: MailService,
    private readonly userProfileService: UserProfilesService,
    private userRepository: UserRepository<UserEntity>,
    private userProfileRepository: UserProfileRepository<UserProfileEntity>,
    private imageLinksRepository: ImagesLinksRepository<ImagesLinksEntity>,
    private imagesRepository: ImagesRepository<ImagesEntity>,
    private readonly redisCacheService: CacheService,
    private readonly cronJob: TasksService,
  ) {}

  async createUser(registerData): Promise<UserEntity> {
    const checkUserExists = await this.userRepository.findOne({
      where: [{ email: registerData.email }, { phone: registerData.phone }],
    });

    if (checkUserExists) {
      throw new HttpException(
        'Số điện thoại hoặc email đã được sử dụng.',
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
    const user: UserEntity = await this.userRepository.findById(id);
    if (!user) {
      throw new HttpException(
        'Người dùng không tồn tại.',
        HttpStatus.NOT_FOUND,
      );
    }
    user['image'] = await this.getUserImage(user.user_id);
    return preprocessUserResult(user);
  }

  async updateUser(
    user_id: number,
    dataObj: ObjectLiteral,
  ): Promise<UserEntity> {
    const updatedUser = await this.userRepository.update(user_id, dataObj);
    updatedUser['image'] = await this.getUserImage(updatedUser.user_id);
    return preprocessUserResult(updatedUser);
  }

  async findOne(dataObj: ObjectLiteral | ObjectLiteral[]): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: dataObj });
    return user;
  }

  async getUserImage(user_id: number): Promise<ImagesEntity> {
    const imageLinks = await this.imageLinksRepository.findOne({
      where: {
        object_id: user_id,
        object_type: ImageObjectType.USER,
      },
    });
    if (imageLinks) {
      const image = await this.imagesRepository.findById(imageLinks.image_id);
      return image;
    }
    return null;
  }

  async resetPasswordByEmail(
    originUrl: string,
    email: string,
  ): Promise<boolean> {
    const user: any = await this.userRepository.findOne({
      where: { email },
    });
    if (!user) {
      throw new HttpException(
        'Người dùng không tồn tại.',
        HttpStatus.NOT_FOUND,
      );
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
    // this.cronJob.addCronJob('get-info', '10');

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
    user['image'] = await this.getUserImage(user.user_id);

    return preprocessUserResult(user);
  }

  async restorePasswordByEmail(
    user_id: string,
    token: string,
  ): Promise<UserEntity> {
    const checkUser: any = await this.userRepository.findOne({
      where: { user_id, verify_token: token },
    });

    if (!checkUser) {
      throw new HttpException(
        'Người dùng không tồn tại.',
        HttpStatus.NOT_FOUND,
      );
    }

    if (new Date(checkUser.verify_token_exp).getTime() < new Date().getTime()) {
      throw new HttpException('Token hết hạn.', HttpStatus.GATEWAY_TIMEOUT);
    }
    return checkUser;
  }

  async updatePasswordByEmail(
    user_id: number,
    token: string,
    newPassword: string,
  ): Promise<boolean> {
    const user: any = await this.userRepository.findOne({
      where: {
        user_id,
        verify_token: token,
      },
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    if (new Date(user.verify_token_exp).getTime() < new Date().getTime()) {
      throw new HttpException(
        'Token đã hết hiệu lực, cập nhật thất bại.',
        HttpStatus.GATEWAY_TIMEOUT,
      );
    }

    const { passwordHash, salt } = saltHashPassword(newPassword);

    await this.userRepository.update(user_id, {
      password: passwordHash,
      salt,
      verify_token: '',
    });
    return true;
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
      throw new BadRequestException('Số lần nhập mã OTP vượt quá giới hạn');
    }
    if (user.otp !== otp) {
      const otp_incorrect_times = user.otp_incorrect_times + 1;
      await this.userRepository.update(user.user_id, {
        otp_incorrect_times,
      });

      throw new BadRequestException('OTP không chính xác');
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
    updatedProfile['image'] = await this.getUserImage(updatedProfile.user_id);
    return updatedProfile;
  }
}
