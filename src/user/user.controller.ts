import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  UseFilters,
} from '@nestjs/common';
import { UserService } from './user.service';
import { IUser } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get()
  findAll(): Promise<IUser[]> {
    return this.userService.findAll();
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto): Promise<IUser> {
    return this.userService.createUser(createUserDto);
  }
}
