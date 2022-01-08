import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { AuthRestoreDto } from './dto/auth-restore.dto';
import { IUser } from '../users/interfaces/users.interfaces';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('signup')
  @UsePipes(ValidationPipe)
  async signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<IUser> {
    return this.authService.signUp(authCredentialsDto);
  }
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req): Promise<any> {
    return this.authService.login(req.user);
  }
  @Post('reset-password')
  async resetPassword(@Body() authRestoreDto: AuthRestoreDto): Promise<void> {
    return this.authService.resetPassword(authRestoreDto);
  }
}
