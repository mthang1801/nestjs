import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AuthCredentialsDto } from '../dto/auth-credential.dto';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserAuthSocialMedia } from '../interfaces/users.interface';
import { saltHashPassword, desaltHashPassword } from '../../utils/cipherHelper';
import { PrimaryKeys } from '../../database/enums/primary-keys.enum';
import { convertToMySQLDateTime } from '../../utils/helper';
import { AuthProviderRepository } from '../repositories/auth.repository';
import { BaseService } from '../../base/base.service';
import { AuthProvider } from '../entities/auth-provider.entity';
import { LoggerService } from '../../logger/custom.logger';
import { Table } from '../../database/enums/tables.enum';
import { IUser } from '../interfaces/users.interface';
import { IAuthToken } from '../interfaces/auth.interface';
import { AuthProviderEnum } from '../helpers/enums/auth-provider.enum';
import { generateOTPDigits } from '../../utils/helper';
import * as twilio from 'twilio';
@Injectable()
export class AuthService extends BaseService<
  AuthProvider,
  AuthProviderRepository<AuthProvider>
> {
  protected authRepository: AuthProviderRepository<AuthProvider>;
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    repository: AuthProviderRepository<AuthProvider>,
    logger: LoggerService,
    table: Table,
  ) {
    super(repository, logger, table);
    this.authRepository = repository;
    this.table = Table.USERS_AUTH;
  }

  generateToken(user: any): IAuthToken {
    const payload = { sub: user[PrimaryKeys.ddv_users] };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<IAuthToken> {
    const { firstname, lastname, email, password, phone } = authCredentialsDto;
    const { passwordHash, salt } = saltHashPassword(password);

    const user = await this.userService.createUser({
      firstname,
      lastname,
      email,
      password: passwordHash,
      phone,
      salt,
      created_at: convertToMySQLDateTime(),
    });

    return this.generateToken(user);
  }
  async validateUser(username: string, password: string): Promise<IUser> {
    const user = await this.userService.findOne({ email: username });
    if (!user) {
      throw new NotFoundException();
    }
    const checkPwd = await bcrypt.compare(password, user.password);
    if (!checkPwd) {
      throw new BadRequestException({
        message: 'Tài khoản hoặc mật khẩu không đúng.',
      });
    }
    return user;
  }
  async login(data: any): Promise<IAuthToken> {
    const phone = data['phone'];
    const email = data['email'];
    const password = data['password'];
    try {
      let user: User = phone
        ? await this.userService.findOne({ phone })
        : await this.userService.findOne({ email });
      console.log(user);
      if (!user) {
        throw new NotFoundException({ message: 'Người dùng không tồn tại' });
      }
      if (desaltHashPassword(password, user.salt) !== user.password) {
        throw new BadRequestException({
          message: 'Tài khoản hoặc mật khẩu không đúng.',
        });
      }

      return this.generateToken(user);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async loginWithAuthProvider(
    user: UserAuthSocialMedia,
    providerName: AuthProviderEnum,
  ): Promise<AuthProvider> {
    let userExists: User = await this.userService.findOne({
      email: user.email,
    });
    if (!userExists) {
      userExists = await this.userService.create({
        firstname: user.givenName,
        lastname: user.familyName,
        email: user.email,
        created_at: convertToMySQLDateTime(),
      });
    }
    const authProvider: AuthProvider = await this.authRepository.create({
      user_id: userExists.user_id,
      provider: user.id,
      provider_name: providerName,
      access_token: user.accessToken,
      extra_data: user.refreshToken || '',
      created_date: convertToMySQLDateTime(),
    });

    return authProvider;
  }

  async loginWithGoogle(user: UserAuthSocialMedia): Promise<AuthProvider> {
    return this.loginWithAuthProvider(user, AuthProviderEnum.GOOGLE);
  }

  async loginWithFacebook(user: UserAuthSocialMedia): Promise<AuthProvider> {
    return this.loginWithAuthProvider(user, AuthProviderEnum.FACEBOOK);
  }

  async resetPasswordByEmail(url: string, email: string): Promise<boolean> {
    await this.userService.resetPasswordByEmail(url, email);
    return true;
  }
  async restorePasswordByEmail(user_id: string, token: string): Promise<IUser> {
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
    try {
      const user = await this.userService.findOne({ phone });
      if (!user) {
        throw new NotFoundException({
          message: 'Số điện thoại chưa được đăng ký.',
        });
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
      await this.userService.updateUserOTPExpiration(user.user_id);
      return newOTP;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}