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
