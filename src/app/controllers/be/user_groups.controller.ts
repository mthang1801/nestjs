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
import {
  CreateUserGroupsDto,
  CreateUserGroupDescriptionDto,
} from '../../dto/usergroups/create-usergroups.dto';
import { UserGroupsService } from '../../services/user_groups.service';
import { BaseController } from '../../../base/base.controllers';
import { IUser } from '../../interfaces/users.interface';
import { IResponse } from '../../interfaces/response.interface';
import { AuthGuard } from '../../../middlewares/be.auth';
import { Roles } from 'src/app/helpers/decorators/roles.decorator';
import { Response } from 'express';

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

  @Post()
  @UseGuards(AuthGuard)
  @Roles('admin')
  async createUserGroup(
    @Body() data: CreateUserGroupsDto,
    @Res() res: Response,
  ): Promise<IResponse> {
    const newUserGroup = await this.usersGroupService.createUserGroup(data);
    return this.respondCreated(res, newUserGroup);
  }

  @Post('/description')
  @UseGuards(AuthGuard)
  async createUserGroupDescription(
    @Body() data: CreateUserGroupDescriptionDto,
    @Res() res: Response,
  ): Promise<IResponse> {
    const newUserGroupDesc =
      await this.usersGroupService.createUserGroupDescription(data);
    return this.respondCreated(res, newUserGroupDesc);
  }
}
