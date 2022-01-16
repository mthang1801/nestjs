import { IsString } from 'class-validator';

export class UserInfoUpdateDto {
  @IsString()
  displayName: string;
  @IsString()
  country: string;
  @IsString()
  city: string;
  @IsString()
  district: string;
  @IsString()
  address: string;
  @IsString()
  phone: string;
}
