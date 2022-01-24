export interface UserGroupEntity {
  usergroup_id: number;
  status: string;
  type: string;
  company_id: number;
}

export interface UserGroupPrivilegeEntity {
  usergroup_id: number;
  privilege: string;
  description: string;
}

export interface UserGroupLinkEntity {
  link_id: number;
  user_id: number;
  usergroup_id: number;
  status: string;
}

export interface UserGroupDescriptionEntity {
  usergroup_id: number;
  langcode: string;
  usergroup: string;
}
