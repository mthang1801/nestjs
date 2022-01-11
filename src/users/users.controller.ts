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
import { User } from './user.entity';

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
  async getMyInfo(@Req() req): Promise<User> {
    return this.usersService.getMyInfo(req.user._id);
  }

  @Get('/:id')
  async getUserById(@Req() req): Promise<User> {
    return this.usersService.findById(req.params.id);
  }
}
