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
  Injectable,
} from '@nestjs/common';
import { UserInfoUpdateDto } from '../../dto/update-userinfo.dto';
import { JwtAuthGuard } from '../../helpers/auth/guards/jwt-auth.guard';
import { UsersService } from '../../services/users.service';
import { User } from '../../entities/user.entity';
import { IUser } from '../../interfaces/users.interfaces';
import { BaseController } from '../../../base/base.controllers';
import { IResponseDataSuccess } from '../../interfaces/response.interface';
@Controller('/be/v1/users')
@Injectable()
export class UsersController extends BaseController {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async updateUserInfo(
    @Body() userInfoUpdateDto: UserInfoUpdateDto,
    @Req() req,
    @Res() res,
  ): Promise<IResponseDataSuccess<IUser>> {
    const { user_id } = req.user;
    const updatedUser = await this.usersService.updateUserInfo(
      user_id,
      userInfoUpdateDto,
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

  @Get('/:id')
  async getUserById(
    @Req() req,
    @Res() res,
  ): Promise<IResponseDataSuccess<IUser>> {
    const user = await this.usersService.findById(req.params.id);
    return this.responseSuccess(res, user);
  }
}
