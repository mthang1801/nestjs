import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { AuthRestoreDto } from '../auth/dto/auth-restore.dto';
import { IUser } from '../users/interfaces/users.interfaces';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  generateToken(user: any) {
    const payload = { sub: user._id.toString() };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<any> {
    const user = await this.userService.createUser(authCredentialsDto);
    return this.generateToken(user);
  }
  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findOne(username);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }
  login(user: any) {
    return this.generateToken(user);
  }
  async resetPassword(url: string, data: string): Promise<any> {
    const res = await this.userService.resetPassword(url, data);
    return res;
  }
  async restorePassword(_id: string, token: string): Promise<IUser> {
    const user = await this.userService.restorePassword(_id, token);
    return user;
  }
  async updatePassword(authRestoreDto: AuthRestoreDto): Promise<any> {
    const { _id, password, token } = authRestoreDto;
    return await this.userService.updatePassword(_id, token, password);
  }
}
