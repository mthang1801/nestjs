import {
  Body,
  Controller,
  Get,
  Put,
  UseGuards,
  Req,
  Res,
  UseInterceptors,
  ClassSerializerInterceptor,
  UploadedFiles,
  Post,
  UploadedFile,
} from '@nestjs/common';
import { UserUpdateDto } from '../../dto/user/update-user.dto';
import { UserProfileDto } from '../../dto/user/update-user-profile.dto';
import { UsersService } from '../../services/users.service';
import { UserEntity } from '../../entities/user.entity';
import { BaseController } from '../../../base/base.controllers';
import { IUser } from '../../interfaces/users.interface';
import { IResponse } from '../../interfaces/response.interface';
import { AuthGuard } from '../../../middlewares/fe.auth';
import { Request, Response } from 'express';
import {
  AnyFilesInterceptor,
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import * as multer from 'multer';

@Controller({ version: '1', path: '/fe/users' })
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
  async getMyInfo(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IResponse> {
    console.log('v1');
    // console.log(req.cookies);
    const user = await this.usersService.getMyInfo(req.user.user_id);
    // res.setCookie('secret', 'mysecret');
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

  @Post('single-upload')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: './uploads',
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(86, file);
  }

  @Post('multi-uploads')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'avatar', maxCount: 2 },
        { name: 'background', maxCount: 2 },
      ],
      {
        preservePath: true,
        storage: multer.diskStorage({
          destination: (req, file, cb) => cb(null, './uploads'),
          filename: (req, file, cb) => {
            const filename = `${Date.now()}-${Math.round(
              Math.random() * 1e9,
            )}-${file.originalname}`;
            return cb(null, filename);
          },
        }),
      },
    ),
  )
  uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    console.log(files);
  }
}
