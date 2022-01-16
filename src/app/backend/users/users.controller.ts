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
import { UserInfoUpdateDto } from './dto/update-userinfo.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @UseGuards(JwtAuthGuard)
  @Put()
  async updateUserInfo(
    @Body() userInfoUpdateDto: UserInfoUpdateDto,
    @Req() req,
    @Res() res,
  ): Promise<void> {
    const { id } = req.user;
    await this.usersService.updateUserInfo(id, userInfoUpdateDto);
    return res.send({ statusCode: res.statusCode, message: 'updated' });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getMyInfo(@Req() req): Promise<User> {
    return this.usersService.getMyInfo(req.user.id);
  }

  @Get('/:id')
  async getUserById(@Req() req): Promise<User> {
    return this.usersService.findById(req.params.id);
  }
}
