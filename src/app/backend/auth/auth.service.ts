import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { AuthRestoreDto } from './dto/auth-restore.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcrypt';
import { UserAuthSocialMedia } from '../users/interfaces/users.interfaces';
import {
  saltHashPassword,
  desaltHashPassword,
} from '../../../utils/cipherHelper';
import { PrimaryKeys } from '../../../database/enums/primary-keys.enum';
@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  generateToken(user: any): { access_token: string } {
    const payload = { sub: user[PrimaryKeys.ddv_users] };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<any> {
    const { firstname, lastname, email, password, phone } = authCredentialsDto;
    console.log(firstname, lastname, email, password, phone);
    const { passwordHash, salt } = saltHashPassword(password);

    const user = await this.userService.createUser({
      firstname,
      lastname,
      email,
      password: passwordHash,
      phone,
      salt,
      timestamp: Math.ceil(Date.now() / 1000),
    });
    return this.generateToken(user);
  }
  async validateUser(username: string, password: string): Promise<User> {
    console.log(49, username);
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
  async login(data: any): Promise<any> {
    const phone = data['phone'];
    const email = data['email'];
    const password = data['password'];
    try {
      let user: User = phone
        ? await this.userService.findOne({ phone })
        : await this.userService.findOne({ email });
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

  async loginWithGoogle(
    user: UserAuthSocialMedia,
  ): Promise<{ access_token: string }> {
    const userRes = await this.userService.loginWithGoogle(user);
    return this.generateToken(userRes);
  }

  async loginWithFacebook(
    user: UserAuthSocialMedia,
  ): Promise<{ access_token: string }> {
    const userRes = await this.userService.loginWithFacebook(user);
    return this.generateToken(userRes);
  }

  async resetPassword(url: string, data: string): Promise<boolean> {
    await this.userService.resetPassword(url, data);
    return true;
  }
  async restorePassword(_id: string, token: string): Promise<User> {
    const user = await this.userService.restorePassword(_id, token);
    return user;
  }
  async updatePassword(authRestoreDto: AuthRestoreDto): Promise<boolean> {
    const { _id, password, token } = authRestoreDto;
    await this.userService.updatePassword(+_id, token, password);
    return true;
  }
}
