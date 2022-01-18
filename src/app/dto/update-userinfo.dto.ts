import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UserInfoUpdateDto {
  @IsString()
  @IsOptional()
  firstname: string;

  @IsString()
  @IsOptional()
  lastname: string;

  @IsString()
  @IsOptional()
  company: string;

  @IsString()
  @IsOptional()
  birthday: string;

  @IsString()
  @IsOptional()
  fax: string;

  @IsString()
  @IsOptional()
  url: string;

  @IsString()
  @IsOptional()
  tax_exempt: string;

  @IsString()
  @IsOptional()
  @IsEmail()
  responsible_email: string;
}
