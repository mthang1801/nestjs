import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { AuthRestoreDto } from './dto/auth-restore.dto';
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
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<IUser> {
    return this.userService.createUser(authCredentialsDto);
  }
  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findOne(username);
    if (!user) {
      throw new NotFoundException();
    }
    console.log(await bcrypt.compare(password, user.password));
    return user;
  }
  login(user: any) {
    const payload = { sub: user._id.toString() };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  async resetPassword(authRestoreDto: AuthRestoreDto): Promise<void> {
    const { email, phone } = authRestoreDto;
    await this.userService.resetPassword(email, phone);
  }
}
