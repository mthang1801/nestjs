import {
  Body,
  Controller,
  Get,
  Put,
  Post,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { CreateUserGroupsDto } from '../../dto/usergroups/create-usergroups.dto';
import { JwtAuthGuard } from '../../helpers/auth/guards/jwt-auth.guard';
import { UsersService } from '../../services/users.service';
import { BaseController } from '../../../base/base.controllers';
import { IUser } from '../../interfaces/users.interface';
import { IResponse } from '../../interfaces/response.interface';

/**
 * User groups controllers
 * @author khoa.nt
 */
@Controller('/be/v1/usergroups')
export class UsergroupsController extends BaseController {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  /**
   * Create new record
   * @param createUserGroupsDto
   * @param req
   * @param res
   * @returns
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createUserGroupsDto: CreateUserGroupsDto,
    @Req() req,
    @Res() res,
  ): Promise<IResponse> {
    const { user_id } = req.user;
    const updatedUser = await this.usersService.updateUser(
      user_id,
      createUserGroupsDto,
    );

    return this.responseSuccess(res, updatedUser);
  }
}
