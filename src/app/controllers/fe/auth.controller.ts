import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
  BadRequestException,
  Patch,
  Put,
} from '@nestjs/common';
import { AuthService } from '../../services/auth.service';
import { AuthCredentialsDto } from '../../dto/auth/auth-credential.dto';
import { AuthUpdatePasswordDto } from '../../dto/auth/auth-update-password.dto';
import { IResponse } from '../../interfaces/response.interface';
import { AuthLoginProviderDto } from '../../dto/auth/auth-login-provider.dto';
import { LoginDto } from '../../dto/auth/auth-login.dto';
import { BaseController } from '../../../base/base.controllers';
import { RestorePasswordOTPDto } from '../../dto/auth/auth-restore-pwd-otp.dto';
/**
 * Authentication controller
 * @Describe Using 3 authenticate types : Local, Google, Facebook
 * @Author MvThang
 */
@Controller('/v1/fe/auth')
export class AuthController extends BaseController {
  constructor(private authService: AuthService) {
    super();
  }

  /**
   *  Register account with email or phone and password from FE
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
   * Login account with email or phone and password from FE
   * @param data
   * @param res
   * @returns
   */
  @Post('login')
  async login(@Body() data: LoginDto, @Res() res): Promise<IResponse> {
    const userResponse = await this.authService.login(data);
    return this.responseSuccess(res, userResponse);
  }

  @Get()
  async getAuth(@Res() res) {
    res.render('home-test');
  }

  /**
   * Login with Google provider
   * @param AuthLoginProviderDto
   * @param res
   * @returns
   */
  @Post('/google/login')
  async loginWithGoolge(
    @Body() AuthLoginProviderDto: AuthLoginProviderDto,
    @Res() res,
  ): Promise<IResponse> {
    const userResponse = await this.authService.loginWithGoogle(
      AuthLoginProviderDto,
    );
    return this.responseSuccess(res, userResponse);
  }

  /**
   * Login with Facebook provider
   * @param AuthLoginProviderDto
   * @param res
   * @returns
   */
  @Post('facebook/login')
  async loginWithFacebook(
    @Body() AuthLoginProviderDto: AuthLoginProviderDto,
    @Res() res,
  ): Promise<IResponse> {
    const userResponse = await this.authService.loginWithFacebook(
      AuthLoginProviderDto,
    );
    return this.responseSuccess(res, userResponse);
  }

  /**
   * @Describe When user click reset or forget passwrod button, this request will send to server. Place to receive is here.
   * Server will verify if the email has been existing. Then it will create verify token and token expiration, then send the restore password url to user through this email.
   * @param req
   * @param res
   * @returns
   */
  @Post('reset-password-by-email')
  async resetPasswordByEmail(@Req() req, @Res() res): Promise<IResponse> {
    const fullUrl = req.protocol + '://' + req.get('host');
    const { email } = req.body;

    await this.authService.resetPasswordByEmail(fullUrl, email);
    return this.responseSuccess(
      res,
      null,
      `request to reset password success, please visit to email to activate new password`,
    );
  }

  /**
   * User visit to his / her email, then click verify link which server send before. At this time, server will check query URL including token and user_id and token_exp.
   * If everything is ok, server will render new password form in order to user enable to fill in it
   * If everything is bad, server will raise error immediately
   * @param req
   * @param res
   */
  @Get('forgot-password')
  async restorePasswordByEmail(@Req() req, @Res() res): Promise<void> {
    const { token, user_id } = req.query;
    await this.authService.restorePasswordByEmail(user_id, token);
    res.render('forgot-password-form');
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
  @Put('update-password-by-email')
  async updatePasswordByEmail(
    @Body() authRestoreDto: AuthUpdatePasswordDto,
    @Res() res,
  ): Promise<IResponse> {
    const { user_id, token, password } = authRestoreDto;

    await this.authService.updatePasswordByEmail(user_id, token, password);

    return this.responseSuccess(res, null, `updated`);
  }

  /**
   * Reset password by phone, using OTP sending method
   * @param phone string
   */
  @Post('reset-password-by-otp')
  async resetPasswordByPhone(
    @Body('phone') phone: string,
    @Res() res,
  ): Promise<IResponse> {
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
