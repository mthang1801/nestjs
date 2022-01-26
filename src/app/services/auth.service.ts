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
@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private userProfile: UserProfilesService,
    private authRepository: AuthProviderRepository<AuthProviderEntity>,
    private userGroupRepository: UserGroupLinksRepository<UserGroupLinkEntity>,
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
    await this.userGroupRepository.create({
      user_id: user.user_id,
      usergroup_id: 3,
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
      throw new NotFoundException('User not exists');
    }
    if (desaltHashPassword(password, user.salt) !== user.password) {
      throw new HttpException(
        phone
          ? 'Phone or password is incorrect'
          : 'Email or password is incorrect',
        HttpStatus.UNAUTHORIZED,
      );
    }

    await this.userService.updateUser(user.user_id, {
      user_login: AuthProviderEnum.SYSTEM,
    });

    const dataResult = {
      token: this.generateToken(user),
      userData: preprocessUserResult(user),
    };
    return dataResult;
  }

  async loginWithAuthProvider(
    providerData: AuthLoginProviderDto,
    providerName: AuthProviderEnum,
  ): Promise<IResponseUserToken> {
    let userExists: UserEntity = await this.userService.findOne({
      email: providerData.email,
    });
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
        'Số điện thoại chưa được đăng ký.',
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
      body: `Mã OTP để xác nhận khôi phục mật khẩu là ${newOTP}, mã có hiệu lực trong vòng 90 giây, nhằm đảm bảo tài khoản được an toàn, quý khách vui lòng không chia sẽ mã này cho bất kỳ ai.`,
      from: '+16075368673',
      to: '+84939323700',
    });

    return newOTP;
  }

  async restorePasswordByOTP(user_id: number, otp: number): Promise<boolean> {
    return await this.userService.restorePasswordByOTP(user_id, otp);
  }
}
