import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AuthCredentialsDto } from '../dto/auth/auth-credential.dto';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserAuthSocialMedia } from '../interfaces/users.interface';
import { saltHashPassword, desaltHashPassword } from '../../utils/cipherHelper';
import { PrimaryKeys } from '../../database/enums/primary-keys.enum';
import {
  convertToMySQLDateTime,
  preprocessUserResult,
  generateOTPDigits,
} from '../../utils/helper';
import { AuthProviderRepository } from '../repositories/auth.repository';
import { BaseService } from '../../base/base.service';
import { AuthProviderEntity } from '../entities/auth-provider.entity';
import { LoggerService } from '../../logger/custom.logger';
import { Table } from '../../database/enums/tables.enum';
import { IAuthToken } from '../interfaces/auth.interface';
import { AuthProviderEnum } from '../helpers/enums/auth-provider.enum';
import { GoogleLoginProviderDto } from '../dto/auth/auth-login-provider.dto';
import { UserProfilesService } from '../services/user-profiles.service';
import { HandleResult } from '../helpers/exeptions/exceptions';
// import { IAuthToken } from '../interfaces/auth.interface';
import * as twilio from 'twilio';
@Injectable()
export class AuthService extends BaseService<
  AuthProviderEntity,
  AuthProviderRepository<AuthProviderEntity>
> {
  protected authRepository: AuthProviderRepository<AuthProviderEntity>;
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private userProfile: UserProfilesService,
    repository: AuthProviderRepository<AuthProviderEntity>,
    logger: LoggerService,
    table: Table,
  ) {
    super(repository, logger, table);
    this.authRepository = repository;
    this.table = Table.USERS_AUTH;
  }

  generateToken(user: any): any {
    const payload = { sub: user[PrimaryKeys.ddv_users] };
    return this.jwtService.sign(payload);
  }

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const { firstname, lastname, email, password, phone } =
          authCredentialsDto;
        const { passwordHash, salt } = saltHashPassword(password);

        const userResponse = await this.userService.createUser({
          firstname,
          lastname,
          email,
          password: passwordHash,
          phone,
          salt,
          created_at: convertToMySQLDateTime(),
        });

        if (!userResponse.success) {
          return reject(userResponse);
        }

        resolve(
          this.responseSuccess({
            token: this.generateToken(userResponse.data.user),
            userData: userResponse.data.user,
          }),
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  async login(data: any): Promise<any> {
    const phone = data['phone'];
    const email = data['email'];
    const password = data['password'];
    return new Promise(async (resolve, reject) => {
      try {
        let user: UserEntity = phone
          ? await this.userService.findOne({ phone })
          : await this.userService.findOne({ email });

        if (!user) {
          return reject(this.errorNotFound('Người dùng không tồn tại.'));
        }
        if (desaltHashPassword(password, user.salt) !== user.password) {
          return reject(
            this.optionalResponse(200, 'Tài khoản hoặc mật khẩu không đúng'),
          );
        }

        return resolve(
          this.responseSuccess({
            token: this.generateToken(user),
            userData: preprocessUserResult(user),
          }),
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  async loginWithAuthProvider(
    providerData: GoogleLoginProviderDto,
    providerName: AuthProviderEnum,
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        let userExists: any = await this.userService.findOne({
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
        }
        const userProfile = await this.userProfile.findById(userExists.user_id);

        if (!userProfile) {
          await this.userProfile.createUserProfile(userExists);
        }

        let authProvider: AuthProviderEntity =
          await this.authRepository.findOne({
            user_id: userExists.user_id,
            provider_name: providerName,
          });

        if (!authProvider) {
          authProvider = await this.authRepository.create({
            user_id: userExists.user_id,
            provider: providerData.google_id,
            provider_name: providerName,
            access_token: providerData.accessToken,
            extra_data: '',
            created_date: convertToMySQLDateTime(),
          });
        }
        resolve(
          this.responseSuccess({
            token: this.generateToken(userExists),
            userData: preprocessUserResult(userExists),
          }),
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  async loginWithGoogle(
    googleLoginProvider: GoogleLoginProviderDto,
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        resolve(
          this.loginWithAuthProvider(
            googleLoginProvider,
            AuthProviderEnum.GOOGLE,
          ),
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  async resetPasswordByEmail(url: string, email: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.userService.resetPasswordByEmail(url, email);
        resolve(true);
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
        const user = await this.userService.renderForgotPasswordByEmail(
          user_id,
          token,
        );

        resolve(preprocessUserResult(user));
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  async updatePasswordByEmail(
    user_id: number,
    token: string,
    password: string,
  ): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.userService.updatePasswordByEmail(user_id, token, password);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }

  // async resetPasswordByPhone(phone: string): Promise<number> {
  //   try {
  //     const user = await this.userService.findOne({ phone });
  //     if (!user) {
  //       throw new NotFoundException({
  //         message: 'Số điện thoại chưa được đăng ký.',
  //       });
  //     }
  //     const newOTP = generateOTPDigits();
  //     await this.userService.updateUserOTP(user.user_id, newOTP);

  //     const client = twilio(
  //       'ACf45884c1ecedeb6821c81156065d8610',
  //       '08fa4d62968cbff2e9c017ccb3a16219',
  //     );
  //     await client.messages.create({
  //       body: `Mã OTP để xác nhận khôi phục mật khẩu là ${newOTP}, mã có hiệu lực trong vòng 90 giây, nhằm đảm bảo tài khoản được an toàn, quý khách vui lòng không chia sẽ mã này cho bất kỳ ai.`,
  //       from: '+16075368673',
  //       to: '+84939323700',
  //     });

  //     return newOTP;
  //   } catch (error) {
  //     throw new InternalServerErrorException(error);
  //   }
  // }

  // async restorePasswordByOTP(user_id: number, otp: number): Promise<boolean> {
  //   return await this.userService.restorePasswordByOTP(user_id, otp);
  // }
}
