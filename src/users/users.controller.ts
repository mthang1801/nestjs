import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserInfoUpdateDto } from './dto/users.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { IUserInfo } from './interfaces/users.interfaces';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @UseGuards(JwtAuthGuard)
  @Patch('/me/update-info')
  async updateUserInfo(
    @Body() userInfoUpdateDto: UserInfoUpdateDto,
  ): Promise<void> {
    console.log(userInfoUpdateDto);
  }
  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async getMyInfo(@Req() req): Promise<IUserInfo> {
    return this.usersService.getMyInfo(req.user._id);
  }
}
