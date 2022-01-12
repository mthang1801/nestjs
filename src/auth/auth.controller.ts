import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';

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
  async signUp(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ access_token: string }> {
    return await this.authService.signUp(authCredentialsDto);
  }
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req): Promise<{ access_token: string }> {
    return this.authService.login(req.user);
  }
  @Post('reset-password')
  async resetPassword(@Req() req, @Res() res): Promise<void> {
    const fullUrl = req.protocol + '://' + req.get('host');
    const { data } = req.body;

    await this.authService.resetPassword(fullUrl, data);
    res.send({
      statusCode: res.statusCode,
      message: `request to reset password success, please visit to : ${fullUrl} to activate new password`,
    });
  }
  @Get('restore-password')
  async restorePassword(@Req() req, @Res() res): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const { token, _id } = req.query;
        await this.authService.restorePassword(_id, token);
        res.status(200).render('restore-password');
      } catch (error) {
        throw new BadRequestException(error);
      }
    });
  }

  @Post('update-password')
  async updatePassword(
    @Body() authRestoreDto: AuthRestoreDto,
    @Res() res,
  ): Promise<void> {
    await this.authService.updatePassword(authRestoreDto);
    res.send({ statusCode: res.statusCode, message: 'updated' });
  }
}
