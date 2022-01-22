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
  Next,
} from '@nestjs/common';
import { AuthService } from '../../services/auth.service';
import { AuthCredentialsDto } from '../../dto/auth/auth-credential.dto';
import { AuthUpdatePasswordDto } from '../../dto/auth/auth-update-password.dto';
import { IResponseDataSuccess } from '../../interfaces/response.interface';
import { GoogleAuthGuard } from '../../helpers/auth/guards/google-auth.guard';
import { FacebookAuthGuard } from '../../helpers/auth/guards/facebook-auth.guards';
import { AuthProviderEntity } from '../../entities/auth-provider.entity';
import { GoogleLoginProviderDto } from '../../dto/auth/auth-login-provider.dto';
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
  @Post('register')
  @UsePipes(ValidationPipe)
  async signUp(
    @Body() authCredentialsDto: AuthCredentialsDto,
    @Res() res,
  ): Promise<any> {
    const dataResponse = await this.authService.signUp(authCredentialsDto);

    return this.optionalResponse(
      res,
      dataResponse.statusCode,
      dataResponse.data,
      dataResponse.message,
      dataResponse.success,
    );
  }

  /**
   * Login with email or phone and password
   * @param data
   * @param res
   * @returns
   */
  @Post('login')
  async login(@Body() data: LoginDto, @Res() res, @Next() next): Promise<any> {
    try {
      const error: any = new Error('Login failed');
      error.statusCode = 403;
      error.success = false;
      throw error;
    } catch (error) {
      next(error);
    }
    // const dataResponse = await this.authService.login(data);

    // if (dataResponse.statusCode === 200 && dataResponse.success) {
    //   return this.responseSuccess(res, dataResponse.data, dataResponse.message);
    // }
    // return this.optionalResponse(
    //   res,
    //   dataResponse.statusCode,
    //   dataResponse.data,
    //   dataResponse.message,
    //   dataResponse.success,
    // );
  }

  /**
   * Render page with 2 buttons login google and login facebook
   */
  @Get()
  renderAuthPage(@Res() res: Response) {
    res.render('authentication');
  }

  @Post('/google/login')
  async loginWithGoolge(
    @Body() googleLoginProvider: GoogleLoginProviderDto,
    @Res() res,
    s,
  ): Promise<any> {
    const userResponse = await this.authService.loginWithGoogle(
      googleLoginProvider,
    );
    if (userResponse.statusCode === 200) {
      return this.responseSuccess(res, userResponse.data);
    }
    return this.optionalResponse(
      res,
      userResponse.statusCode,
      null,
      userResponse.message,
      false,
    );
  }

  @Post('/facebook/login')
  async loginWithFacebook(): Promise<void> {}

  /**
   * @Describe When user click reset or forget passwrod button, this request will send to server. Place to receive is here.
   * Server will verify if the email has been existing. Then it will create verify token and token expiration, then send the restore password url to user through this email.
   * @param req
   * @param res
   * @returns
   */
  @Post('reset-password-by-email')
  async resetPasswordByEmail(
    @Req() req,
    @Res() res,
  ): Promise<IResponseDataSuccess<string>> {
    const fullUrl = req.protocol + '://' + req.get('host');
    const { email } = req.body;

    await this.authService.resetPasswordByEmail(fullUrl, email);
    return this.responseSuccess(
      res,
      {},
      'Yêu cầu khôi phục tài khoản thành công, quý khách vui lòng truy cập vào email để cập nhật lại mật khẩu mới.',
    );
  }

  /**
   * User visit to his / her email, then click verify link which server send before. At this time, server will check query URL including token and user_id and token_exp.
   * If everything is ok, server will render new password form in order to user enable to fill in it
   * If everything is bad, server will raise error immediately
   * @param req
   * @param res
   */
  @Get('restore-password')
  async restorePasswordByEmail(@Req() req, @Res() res): Promise<void> {
    try {
      const { token, user_id } = req.query;
      await this.authService.restorePasswordByEmail(user_id, token);
      res.render('restore-password');
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * @Describe When user submit password form, server will received user_id, token and password
   * Next, server will find user by user_id, token
   * If finding user, server will compare now time with verify_token_expiration
   * Server will perform update new password, remove verify token
   * @param authRestoreDto {user_id : number; token : string; password : stringh}
   * @param res
   * @returns
   */
  @Post('update-password-by-email')
  async updatePasswordByEmail(
    @Body() authRestoreDto: AuthUpdatePasswordDto,
    @Res() res,
  ): Promise<IResponseDataSuccess<string>> {
    const { user_id, token, password } = authRestoreDto;

    await this.authService.updatePasswordByEmail(user_id, token, password);

    return this.responseSuccess(res, {}, `Cập nhật thành công.`);
  }

  /**
   * Reset password by phone, using OTP sending method
   * @param phone string
   */
  @Post('reset-password-by-otp')
  async resetPasswordByPhone(
    @Body('phone') phone: string,
    @Res() res,
  ): Promise<IResponseDataSuccess<number>> {
    const otp = await this.authService.resetPasswordByPhone(phone);
    return this.respondCreated(res, { otp });
  }

  /**
   *
   * @param restorePwd RestorePasswordOTPDto
   */
  @Post('restore-password-by-otp')
  async restorePasswordByOTP(
    @Body() restorePwdDto: RestorePasswordOTPDto,
    @Res() res,
  ): Promise<void> {
    const { user_id, otp } = restorePwdDto;
    await this.authService.restorePasswordByOTP(user_id, otp);
    res.render('otp-auth');
  }
}
