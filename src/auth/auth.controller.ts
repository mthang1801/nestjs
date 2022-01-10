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
  InternalServerErrorException,
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
    const token = await this.authService.signUp(authCredentialsDto);
    return token;
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
    return new Promise(async (resolve, reject) => {
      try {
        const { token, _id } = req.query;
        const user = await this.authService.restorePassword(_id, token);
        return res.status(200).render('restore-password');
      } catch (error) {
        return res
          .status(400)
          .render('restore-password', { message: error.message });
      }
    });
  }

  @Post('update-password')
  async updatePassword(@Body() authRestoreDto: AuthRestoreDto): Promise<any> {
    return await this.authService.updatePassword(authRestoreDto);
  }
}
