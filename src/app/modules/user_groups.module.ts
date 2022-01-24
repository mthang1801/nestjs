import { Module } from '@nestjs/common';
import { UserGroupsService } from '../services/user_groups.service';
import {
  UserGroupsRepository,
  UserGroupLinksRepository,
  UserGroupDescriptionsRepository,
  UserGroupPrivilegesRepository,
} from '../repositories/user_groups.repository';
import { UsergroupsController } from '../controllers/be/usergroups.controller';

@Module({
  providers: [
    UserGroupsService,
    UserGroupsRepository,
    UserGroupLinksRepository,
    UserGroupDescriptionsRepository,
    UserGroupPrivilegesRepository,
  ],
  exports: [
    UserGroupsService,
    UserGroupLinksRepository,
    UserGroupDescriptionsRepository,
    UserGroupPrivilegesRepository,
  ],
  controllers: [UsergroupsController],
})
export class UserGroupsModule {}
