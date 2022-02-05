import {
  Body,
  Controller,
  Get,
  Put,
  UseGuards,
  Req,
  Res,
  Response,
  UseInterceptors,
  ClassSerializerInterceptor,
  Post,
  UploadedFiles,
} from '@nestjs/common';
import { UserUpdateDto } from '../../dto/user/update-user.dto';
import { UserProfileDto } from '../../dto/user/update-user-profile.dto';
import { UsersService } from '../../services/users.service';
import { UserEntity } from '../../entities/user.entity';
import { BaseController } from '../../../base/base.controllers';
import { IUser } from '../../interfaces/users.interface';
import { IResponse } from '../../interfaces/response.interface';
import { AuthGuard } from '../../../middlewares/fe.auth';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller({ version: '2', path: '/fe/users' })
export class UsersController extends BaseController {
  constructor(private readonly usersService: UsersService) {
    super();
  }
  @UseGuards(AuthGuard)
  @Put()
  async updateUserInfo(
    @Body() userUpdateDto: UserUpdateDto,
    @Req() req,
    @Res() res,
  ): Promise<IResponse> {
    const { user_id } = req.user;
    const updatedUser = await this.usersService.updateUser(
      user_id,
      userUpdateDto,
    );

    return this.responseSuccess(res, updatedUser);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getMyInfo(@Req() req, @Res() res): Promise<IResponse> {
    console.log('v2');
    const user = await this.usersService.getMyInfo(req.user.user_id);
    return this.responseSuccess(res, user);
  }
  @Get('/otp')
  async otp_demo(@Req() req, @Res() res): Promise<void> {
    res.render('otp-auth');
  }
  @Get('find/:id')
  async getUserById(@Req() req, @Res() res): Promise<IResponse> {
    const user = await this.usersService.findById(req.params.id);
    return this.responseSuccess(res, { userData: user });
  }

  @Put('/update-user-profile')
  @UseGuards(AuthGuard)
  async updateUserProfile(
    @Body() userProfileDto: UserProfileDto,
    @Req() req,
    @Res() res,
  ): Promise<IResponse> {
    const updatedUserProfile = await this.usersService.updateProfile(
      req.user.user_id,
      userProfileDto,
    );
    return this.responseSuccess(res, { userProfile: updatedUserProfile });
  }

  @Post('upload')
  @UseInterceptors(AnyFilesInterceptor())
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<any> {
    return;
  }
}
