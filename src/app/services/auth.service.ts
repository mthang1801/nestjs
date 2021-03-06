import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthCredentialsDto } from '../dto/auth/auth-credential.dto';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../entities/user.entity';
import { saltHashPassword, desaltHashPassword } from '../../utils/cipherHelper';
import { PrimaryKeys } from '../../database/enums/primary-keys.enum';
import {
  convertToMySQLDateTime,
  preprocessUserResult,
} from '../../utils/helper';
import { AuthProviderRepository } from '../repositories/auth.repository';
import { BaseService } from '../../base/base.service';
import { AuthProviderEntity } from '../entities/auth-provider.entity';
import { Table } from '../../database/enums/tables.enum';
import { IResponseUserToken } from '../interfaces/response.interface';
import { AuthProviderEnum } from '../helpers/enums/auth_provider.enum';
import { generateOTPDigits } from '../../utils/helper';
import { AuthLoginProviderDto } from '../dto/auth/auth-login-provider.dto';
import { UserProfilesService } from './user_profiles.service';
import * as twilio from 'twilio';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UserGroupLinksRepository } from '../repositories/user_groups.repository';
import { UserGroupLinkEntity } from '../entities/user_groups';
import { UserGroupIdEnum } from '../helpers/enums/user_groups.enum';
import { ImagesService } from './image.service';
import {
  ImagesLinksRepository,
  ImagesRepository,
} from '../repositories/image.repository';
import { ImagesEntity, ImagesLinksEntity } from '../entities/image.entity';
import { ImageObjectType } from '../helpers/enums/image_types.enum';
@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private userProfile: UserProfilesService,
    private authRepository: AuthProviderRepository<AuthProviderEntity>,
    private userGroupRepository: UserGroupLinksRepository<UserGroupLinkEntity>,
    private imageLinksRepository: ImagesLinksRepository<ImagesLinksEntity>,
    private imagesRepository: ImagesRepository<ImagesEntity>,
  ) {}

  generateToken(user: UserEntity): string {
    const payload = {
      sub: {
        user_id: user.user_id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phone: user.phone,
      },
    };
    return this.jwtService.sign(payload);
  }

  async signUp(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<IResponseUserToken> {
    const { firstname, lastname, email, password, phone } = authCredentialsDto;
    const { passwordHash, salt } = saltHashPassword(password);

    const user = await this.userService.createUser({
      firstname,
      lastname,
      user_login: AuthProviderEnum.SYSTEM,
      email,
      password: passwordHash,
      phone,
      salt,
      created_at: convertToMySQLDateTime(),
    });
    return {
      token: this.generateToken(user),
      userData: preprocessUserResult(user),
    };
  }

  async login(data: any): Promise<IResponseUserToken> {
    const phone = data['phone'];
    const email = data['email'];
    const password = data['password'];

    let user: UserEntity = phone
      ? await this.userService.findOne({ phone })
      : await this.userService.findOne({ email });

    if (!user) {
      throw new NotFoundException('Ng?????i d??ng kh??ng t???n t???i.');
    }
    if (desaltHashPassword(password, user.salt) !== user.password) {
      throw new HttpException(
        phone
          ? 'S??? ??i???n tho???i ho???c m???t kh???u kh??ng ????ng.'
          : '?????a ch??? email ho???c m???t kh???u kh??ng ????ng',
        HttpStatus.UNAUTHORIZED,
      );
    }

    await this.userService.updateUser(user.user_id, {
      user_login: AuthProviderEnum.SYSTEM,
    });

    user['image'] = await this.getUserImage(user.user_id);

    const userGroup = await this.userGroupRepository.findOne({
      user_id: user.user_id,
    });
    console.log(110, userGroup);

    const dataResult = {
      token: this.generateToken(user),
      userData: preprocessUserResult(user),
    };

    return dataResult;
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

  async loginWithAuthProvider(
    providerData: AuthLoginProviderDto,
    providerName: AuthProviderEnum,
  ): Promise<IResponseUserToken> {
    // Check if user has been existings or not
    let userExists: UserEntity = await this.userService.findOne({
      email: providerData.email,
    });

    console.log(143, userExists);

    if (!userExists) {
      userExists = await this.userService.create({
        firstname: providerData.givenName,
        lastname: providerData.familyName,
        email: providerData.email,
        created_at: convertToMySQLDateTime(),
      });
      await this.userProfile.createUserProfile(userExists);
      await this.userGroupRepository.create({
        user_id: userExists.user_id,
        usergroup_id: UserGroupIdEnum.Wholesale,
      });
    }
    // Create image at ddv_images and ddv_image_links
    let userImageLink = await this.imageLinksRepository.findOne({
      where: {
        object_id: userExists.user_id,
        object_type: ImageObjectType.USER,
      },
    });
    let userImage;
    if (!userImageLink) {
      const userImage = await this.imagesRepository.create({
        image_path: providerData.imageUrl,
      });
      if (userImage) {
        userImageLink = await this.imageLinksRepository.create({
          object_id: userExists.user_id,
          object_type: ImageObjectType.USER,
          image_id: userImage.image_id,
        });
      }
    } else {
      userImage = await this.imagesRepository.findById(userImageLink.image_id);
    }
    userExists['image'] = userImage;
    // Create or update at ddv_users_auth_external table
    let authProvider: AuthProviderEntity = await this.authRepository.findOne({
      where: {
        user_id: userExists.user_id,
        provider_name: providerName,
      },
    });

    if (!authProvider) {
      authProvider = await this.authRepository.create({
        user_id: userExists.user_id,
        provider: providerData.id,
        provider_name: providerName,
        access_token: providerData.accessToken,
        extra_data: providerData.extra_data,
        created_date: convertToMySQLDateTime(),
      });
    } else {
      authProvider = await this.authRepository.update(
        { user_id: authProvider.user_id, provider_name: providerName },
        {
          access_token: providerData.accessToken,
          extra_data: providerData.extra_data,
        },
      );
    }

    //Update current provider at ddv_users
    await this.userService.updateUser(userExists.user_id, {
      user_login: providerName,
    });
    const userData = {
      ...preprocessUserResult(userExists),
      authProvider: { ...authProvider },
    };
    return {
      token: this.generateToken(userExists),
      userData,
    };
  }

  async loginWithGoogle(
    authLoginProviderDto: AuthLoginProviderDto,
  ): Promise<IResponseUserToken> {
    return this.loginWithAuthProvider(
      authLoginProviderDto,
      AuthProviderEnum.GOOGLE,
    );
  }
  async loginWithFacebook(
    authLoginProviderDto: AuthLoginProviderDto,
  ): Promise<IResponseUserToken> {
    return this.loginWithAuthProvider(
      authLoginProviderDto,
      AuthProviderEnum.FACEBOOK,
    );
  }

  async resetPasswordByEmail(url: string, email: string): Promise<boolean> {
    await this.userService.resetPasswordByEmail(url, email);
    return true;
  }
  async restorePasswordByEmail(
    user_id: string,
    token: string,
  ): Promise<UserEntity> {
    const user = await this.userService.restorePasswordByEmail(user_id, token);
    return user;
  }
  async updatePasswordByEmail(
    user_id: number,
    token: string,
    password: string,
  ): Promise<boolean> {
    await this.userService.updatePasswordByEmail(user_id, token, password);
    return true;
  }

  async resetPasswordByPhone(phone: string): Promise<number> {
    const user = await this.userService.findOne({ phone });
    if (!user) {
      throw new HttpException(
        'S??? ??i???n tho???i ch??a ???????c ????ng k??.',
        HttpStatus.NOT_FOUND,
      );
    }
    const newOTP = generateOTPDigits();

    await this.userService.updateUserOTP(user.user_id, newOTP);

    const client = twilio(
      'ACf45884c1ecedeb6821c81156065d8610',
      '08fa4d62968cbff2e9c017ccb3a16219',
    );

    await client.messages.create({
      body: `M?? OTP ????? x??c nh???n kh??i ph???c m???t kh???u l?? ${newOTP}, m?? c?? hi???u l???c trong v??ng 90 gi??y, nh???m ?????m b???o t??i kho???n ???????c an to??n, qu?? kh??ch vui l??ng kh??ng chia s??? m?? n??y cho b???t k??? ai.`,
      from: '+16075368673',
      to: '+84939323700',
    });

    return newOTP;
  }

  async restorePasswordByOTP(user_id: number, otp: number): Promise<boolean> {
    return await this.userService.restorePasswordByOTP(user_id, otp);
  }
}
