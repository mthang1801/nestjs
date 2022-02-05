import {
  Body,
  Controller,
  Get,
  Put,
  Post,
  UseGuards,
  Req,
  Res,
  UseFilters,
  UseInterceptors,
  CacheInterceptor,
  CacheKey,
} from '@nestjs/common';
import { UserUpdateDto } from '../../dto/user/update-user.dto';
import { UsersService } from '../../services/users.service';
import { UserEntity } from '../../entities/user.entity';
import { BaseController } from '../../../base/base.controllers';
import { IUser } from '../../interfaces/users.interface';
import { IResponse } from '../../interfaces/response.interface';
import { AuthGuard } from '../../../middlewares/be.auth';
import { AuthGuardTest } from '../../../middlewares/auth';
import { Roles } from 'src/app/helpers/decorators/roles.decorator';
import { HttpExceptionFilterTest } from '../../../middlewares/http-exeption.filter';
import { HttpException, HttpStatus } from '@nestjs/common';
import { User } from 'src/app/helpers/decorators/user.decorator';

@Roles('user')
@Controller('/be/v1/users')
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
    const user = await this.usersService.getMyInfo(req.user.user_id);
    return this.responseSuccess(res, user);
  }
  @Get('/otp')
  async otp_demo(@Req() req, @Res() res): Promise<void> {
    res.render('otp-auth');
  }
  @Get('/find/:id')
  async getUserById(@Req() req, @Res() res): Promise<IResponse> {
    const user = await this.usersService.findById(req.params.id);
    return this.responseSuccess(res, { userData: user });
  }

  @Post('/upload-images')
  @UseGuards(AuthGuardTest)
  @Roles('user1')
  async uploadImages(@Body() body) {
    console.log(body);
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }

  @Get('test')
  @UseGuards(AuthGuard)
  async getTest(@User() user: UserEntity) {
    console.log(user);
  }
}
