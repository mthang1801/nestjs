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
import { UserGroupsService } from '../../services/user_groups.service';
import { BaseController } from '../../../base/base.controllers';
import { IUser } from '../../interfaces/users.interface';
import { IResponse } from '../../interfaces/response.interface';
import { AuthGuard } from '../../../middlewares/fe.auth';

/**
 * User groups controllers
 * @author khoa.nt
 */
@Controller('/be/v1/usergroups')
export class UsergroupsController extends BaseController {
  constructor(private readonly usersGroupService: UserGroupsService) {
    super();
  }

  /**
   * Create new record
   * @param createUserGroupsDto
   * @param req
   * @param res
   * @returns
   */
  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() createUserGroupsDto: CreateUserGroupsDto,
    @Req() req,
    @Res() res,
  ): Promise<void> {}
}
