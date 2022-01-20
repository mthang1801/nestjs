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
import { AuthRestoreDto } from '../../dto/auth/auth-restore.dto';
import * as express from 'express';
import { GoogleAuthGuard } from '../../helpers/auth/guards/google-auth.guard';
import { FacebookAuthGuard } from '../../helpers/auth/guards/facebook-auth.guards';
import { IAuthProvider } from '../../interfaces/auth.interface';

/**
 * Authentication controller
 * @Describe Using 3 authenticate types : Local, Google, Facebook
 * @Author MvThang
 */
@Controller('/fe/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('register')
  @UsePipes(ValidationPipe)
  async signUp(
    @Body() authCredentialsDto: AuthCredentialsDto,
    @Res() res,
  ): Promise<{ status_code: number; access_token: string }> {
    const { access_token } = await this.authService.signUp(authCredentialsDto);
    return res.status(201).send({ status_code: 201, access_token });
  }

  @Post('login')
  async login(
    @Body() data: { email?: string; phone?: string; password: string },
    @Res() res,
  ): Promise<{ status_code: number; access_token: string }> {
    const { access_token } = await this.authService.login(data);
    return res.status(200).send({ status_code: 200, access_token });
  }

  /**
   * Render page with 2 buttons login google and login facebook
   */
  @Get()
  renderAuthPage(@Res() res: express.Response) {
    console.log('call');
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
   * @returns
   */
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(
    @Req() req,
    @Res() res,
  ): Promise<{ status_code: number; data: IAuthProvider }> {
    const data = await this.authService.loginWithGoogle(req.user);
    return res.status(201).send({ status_code: 201, data });
  }

  /**
   * Authenticate with google with endpoint /v1/google/login
   */
  @Get('facebook/login')
  @UseGuards(FacebookAuthGuard)
  async loginWithFacebook(): Promise<void> {}

  @Get('facebook/callback')
  @UseGuards(FacebookAuthGuard)
  async facebookAuthRedirect(
    @Req() req,
    @Res() res,
  ): Promise<{ status_code: number; data: IAuthProvider }> {
    const data = await this.authService.loginWithFacebook(req.user);

    return res.status(201).send({ status_code: 201, data });
  }

  @Post('reset-password-by-email')
  async resetPasswordByEmail(@Req() req, @Res() res): Promise<void> {
    const fullUrl = req.protocol + '://' + req.get('host');
    const { email } = req.body;

    await this.authService.resetPasswordByEmail(fullUrl, email);
    res.send({
      statusCode: res.statusCode,
      message: `request to reset password success, please visit to : ${fullUrl} to activate new password`,
    });
  }

  /**
   *
   * @param req
   * @param res
   * @returns
   */
  @Get('restore-password')
  async restorePasswordByEmail(@Req() req, @Res() res): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const { token, user_id } = req.query;
        await this.authService.restorePasswordByEmail(user_id, token);
        res.status(200).render('restore-password');
      } catch (error) {
        throw new BadRequestException(error);
      }
    });
  }

  @Post('update-password-by-email')
  async updatePasswordByEmail(
    @Body() authRestoreDto: any,
    @Res() res,
  ): Promise<void> {
    const { user_id, token, password } = authRestoreDto;
    await this.authService.updatePasswordByEmail(user_id, token, password);
    res.send({ statusCode: res.statusCode, message: 'updated' });
  }
}
