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
import { UserInfoUpdateDto } from '../../dto/update-userinfo.dto';
import { JwtAuthGuard } from '../../helpers/auth/guards/jwt-auth.guard';
import { UsersService } from '../../services/users.service';
import { User } from '../../entities/user.entity';

@Controller('/fe/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @UseGuards(JwtAuthGuard)
  @Put()
  async updateUserInfo(
    @Body() userInfoUpdateDto: UserInfoUpdateDto,
    @Req() req,
    @Res() res,
  ): Promise<{ status_code: number; data: User }> {
    const { user_id } = req.user;
    const updatedUser = await this.usersService.updateUserInfo(
      user_id,
      userInfoUpdateDto,
    );

    return res.status(200).send({ status_code: 200, data: updatedUser });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getMyInfo(
    @Req() req,
    @Res() res,
  ): Promise<{ status_code: string; data: User }> {
    const user = await this.usersService.getMyInfo(req.user.user_id);
    return res.status(200).send({ status_code: 200, data: user });
  }

  @Get('/:id')
  async getUserById(
    @Req() req,
    @Res() res,
  ): Promise<{ status_code: string; data: User }> {
    const user = await this.usersService.findById(req.params.id);
    return res.status(200).send({ status_code: 200, data: user });
  }
}
