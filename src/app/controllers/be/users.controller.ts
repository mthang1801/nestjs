import {
  Body,
  Controller,
  Get,
  Put,
  Post,
  UseGuards,
  Req,
  Res,
  Response,
} from '@nestjs/common';
import { UserUpdateDto } from '../../dto/update-user.dto';
import { JwtAuthGuard } from '../../helpers/auth/guards/jwt-auth.guard';
import { UsersService } from '../../services/users.service';
import { UserEntity } from '../../entities/user.entity';
import { BaseController } from '../../../base/base.controllers';
import { IUser } from '../../interfaces/users.interface';
import { IResponseDataSuccess } from '../../interfaces/response.interface';
@Controller('/be/v1/users')
export class UsersController extends BaseController {
  constructor(private readonly usersService: UsersService) {
    super();
  }
  @UseGuards(JwtAuthGuard)
  @Put()
  async updateUser(
    @Body() userUpdateDto: UserUpdateDto,
    @Req() req,
    @Res() res,
  ): Promise<IResponseDataSuccess<IUser>> {
    const { user_id } = req.user;
    const updatedUser = await this.usersService.updateUser(
      user_id,
      userUpdateDto,
    );

    return this.responseSuccess(res, updatedUser);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getMyInfo(
    @Req() req,
    @Res() res,
  ): Promise<IResponseDataSuccess<IUser>> {
    const user = await this.usersService.getMyInfo(req.user.user_id);
    return this.responseSuccess(res, user);
  }
  @Get('/otp')
  async otp_demo(@Req() req, @Res() res): Promise<void> {
    res.render('otp-auth');
  }
  @Get('/:id')
  async getUserById(
    @Req() req,
    @Res() res,
  ): Promise<IResponseDataSuccess<IUser>> {
    const user = await this.usersService.findById(req.params.id);
    return this.responseSuccess(res, user);
  }
}
