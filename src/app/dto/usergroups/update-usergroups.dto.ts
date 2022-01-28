import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserGroupsDto {
  @IsNotEmpty()
  usergroup_id: number;

  @IsOptional()
  status: string;

  @IsOptional()
  type: string;

  @IsOptional()
  company_id: number;
}

export class UpdateUserGroupDescriptionDto {
  @IsNotEmpty({ message: 'usergroup_id là bắt buộc' })
  usergroup_id: number;

  @IsNotEmpty({ message: 'usergroup là bắt buộc' })
  usergroup: string;

  @IsNotEmpty({ message: 'lang_code là bắt buộc' })
  lang_code: string;
}
