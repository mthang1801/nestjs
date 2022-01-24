export class UserGroupEntity {
  usergroup_id: number;
  status: string;
  type: string;
  company_id: number;
}

export class UserGroupPrivilegeEntity {
  usergroup_id: number;
  privilege: string;
  description: string;
}

export class UserGroupLinkEntity {
  link_id: number;
  user_id: number;
  usergroup_id: number;
  status: string;
}

export class UserGroupDescriptionEntity {
  usergroup_id: number;
  langcode: string;
  usergroup: string;
}
