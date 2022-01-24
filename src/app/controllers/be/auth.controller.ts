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
import { AuthService } from '../../services/auth.service';
import { AuthCredentialsDto } from '../../dto/auth/auth-credential.dto';
import { AuthUpdatePasswordDto } from '../../dto/auth/auth-update-password.dto';
import {
  IResponseUserToken,
  IResponse,
} from '../../interfaces/response.interface';
import { IUser } from '../../interfaces/users.interface';
import { GoogleAuthGuard } from '../../helpers/auth/guards/google-auth.guard';
import { FacebookAuthGuard } from '../../helpers/auth/guards/facebook-auth.guards';
import { AuthProviderEntity } from '../../entities/auth-provider.entity';
import { AuthLoginProviderDto } from '../../dto/auth/auth-login-provider.dto';
import { LoginDto } from '../../dto/auth/auth-login.dto';
import { Response } from 'express';
import { BaseController } from '../../../base/base.controllers';
import { RestorePasswordOTPDto } from '../../dto/auth/auth-restore-pwd-otp.dto';
/**
 * Authentication controller
 * @Describe Using 3 authenticate types : Local, Google, Facebook
 * @Author MvThang
 */
@Controller('/be/v1/auth')
export class AuthController extends BaseController {
  constructor(private authService: AuthService) {
    super();
  }
  /**
   * Register account with email or phone and password from BE
   * @param authCredentialsDto
   * @param res
   * @returns
   */
  @Post('register')
  @UsePipes(ValidationPipe)
  async signUp(
    @Body() authCredentialsDto: AuthCredentialsDto,
    @Res() res,
  ): Promise<IResponse> {
    const userResponse = await this.authService.signUp(authCredentialsDto);
    return this.respondCreated(res, userResponse);
  }

  /**
   * Login account with email or phone and password from BE
   * @param data
   * @param res
   * @returns
   */
  @Post('login')
  async login(@Body() data: LoginDto, @Res() res): Promise<IResponse> {
    const userResponse = await this.authService.login(data);
    return this.responseSuccess(res, userResponse);
  }
}
