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
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { AuthRestoreDto } from './dto/auth-restore.dto';

import { LocalAuthGuard } from './guards/local-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { FacebookAuthGuard } from './guards/facebook-auth.guards';

/**
 * Authentication controller
 * @author Thang
 */
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('register')
  @UsePipes(ValidationPipe)
  async signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<any> {
    return await this.authService.signUp(authCredentialsDto);
  }

  @Post('login')
  // @UseGuards(LocalAuthGuard)
  async login(
    @Body() data: { email?: string; phone?: string; password: string },
  ): Promise<any> {
    return await this.authService.login(data);
  }

  @Get()
  renderAuthPage(@Res() res) {
    res.render('authentication');
  }

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  async loginWithGoogle(@Res() res): Promise<void> {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Req() req): Promise<{ access_token: string }> {
    return this.authService.loginWithGoogle(req.user);
  }

  @Get('facebook/login')
  @UseGuards(FacebookAuthGuard)
  async loginWithFacebook(@Res() res): Promise<void> {}

  @Get('facebook/callback')
  @UseGuards(FacebookAuthGuard)
  async facebookAuthRedirect(
    @Req() req,
    @Res() res,
  ): Promise<{ access_token: string }> {
    const tokenRes = await this.authService.loginWithFacebook(req.user);
    res.send(tokenRes);
    return tokenRes;
  }

  @Post('reset-password-by-email')
  async resetPassword(@Req() req, @Res() res): Promise<void> {
    const fullUrl = req.protocol + '://' + req.get('host');
    const { data } = req.body;

    await this.authService.resetPassword(fullUrl, data);
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
