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
import { AuthCredentialsDto } from '../../dto/auth-credential.dto';
import { AuthUpdatePasswordDto } from '../../dto/auth-update-password.dto';
import {
  IResponseData,
  IResponseToken,
  IResponseMessage,
} from '../../interfaces/response.interface';

import { GoogleAuthGuard } from '../../helpers/auth/guards/google-auth.guard';
import { FacebookAuthGuard } from '../../helpers/auth/guards/facebook-auth.guards';
import { AuthProvider } from '../../entities/auth-provider.entity';
import { LoginDto } from '../../dto/auth-login.dto';
import { Response } from 'express';

/**
 * Authentication controller
 * @Describe Using 3 authenticate types : Local, Google, Facebook
 * @Author MvThang
 */
@Controller('/be/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('register')
  @UsePipes(ValidationPipe)
  async signUp(
    @Body() authCredentialsDto: AuthCredentialsDto,
    @Res() res,
  ): Promise<IResponseToken> {
    const { access_token } = await this.authService.signUp(authCredentialsDto);
    return res.status(201).send({ status_code: 201, access_token });
  }

  @Post('login')
  async login(@Body() data: LoginDto, @Res() res): Promise<IResponseToken> {
    const { access_token } = await this.authService.login(data);
    return res.status(200).send({ status_code: 200, access_token });
  }

  /**
   * Render page with 2 buttons login google and login facebook
   */
  @Get()
  renderAuthPage(@Res() res: Response) {
    res.render('authentication');
  }

  /**
   * Authenticate with google with endpoint /v1/google/login
   */
  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  async loginWithGoogle(): Promise<void> {}

  /**
   * When an request from server to google, google receive and then it will response with an redirect url
   * and auth/google/callback is redirect url to server communicate with google
   * @param req
   * @return an object with status_code and data
   */
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(
    @Req() req,
    @Res() res,
  ): Promise<IResponseData<AuthProvider>> {
    const data = await this.authService.loginWithGoogle(req.user);
    return res.status(201).send({ status_code: 201, data });
  }

  /**
   * Authenticate with google with endpoint /be/v1/google/login
   */
  @Get('facebook/login')
  @UseGuards(FacebookAuthGuard)
  async loginWithFacebook(): Promise<void> {}

  @Get('facebook/callback')
  @UseGuards(FacebookAuthGuard)
  async facebookAuthRedirect(
    @Req() req,
    @Res() res,
  ): Promise<IResponseData<AuthProvider>> {
    const data = await this.authService.loginWithFacebook(req.user);

    return res.status(201).send({ status_code: 201, data });
  }

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
  ): Promise<IResponseMessage> {
    const fullUrl = req.protocol + '://' + req.get('host');
    const { email } = req.body;

    await this.authService.resetPasswordByEmail(fullUrl, email);
    return res.status(200).send({
      status_code: 200,
      message: `request to reset password success, please visit to email to activate new password`,
    });
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
      res.status(200).render('restore-password');
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
  ): Promise<IResponseMessage> {
    const { user_id, token, password } = authRestoreDto;

    await this.authService.updatePasswordByEmail(user_id, token, password);
    return res.status(200).send({ status_code: 200, message: 'updated' });
  }
}
