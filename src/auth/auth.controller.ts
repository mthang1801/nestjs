import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { AuthRestoreDto } from './dto/auth-restore.dto';
import { IUser } from '../users/interfaces/users.interfaces';

import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('register')
  @UsePipes(ValidationPipe)
  async signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<any> {
    return await this.authService.signUp(authCredentialsDto);
  }
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req): Promise<any> {
    return this.authService.login(req.user);
  }
  @Post('reset-password')
  async resetPassword(@Req() req): Promise<void> {
    const fullUrl = req.protocol + '://' + req.get('host');
    const { data } = req.body;

    return this.authService.resetPassword(fullUrl, data);
  }
  @Get('restore-password')
  async restorePassword(@Req() req, @Res() res): Promise<any> {
    const { token, _id } = req.query;
    const user = await this.authService.restorePassword(_id, token);
    res.render('restore-password');
  }

  @Post('update-password')
  async updatePassword(@Body() authRestoreDto: AuthRestoreDto): Promise<any> {
    return await this.authService.updatePassword(authRestoreDto);
  }
}
