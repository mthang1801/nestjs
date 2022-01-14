import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { AuthRestoreDto } from '../auth/dto/auth-restore.dto';
import { IUser } from '../users/interfaces/users.interfaces';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcrypt';
import { UserAuthSocialMedia } from '../users/interfaces/users.interfaces';
@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  generateToken(user: any): { access_token: string } {
    const payload = { sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signUp(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ access_token: string }> {
    const { displayName, email, password, phone } = authCredentialsDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userService.createUser(
      displayName,
      email,
      hashedPassword,
      phone,
    );

    return this.generateToken(user);
  }
  async validateUser(username: string, password: string): Promise<User> {
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
  login(user: any): { access_token: string } {
    return this.generateToken(user);
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
