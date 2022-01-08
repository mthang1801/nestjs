import { IsEmail, Matches } from 'class-validator';

export class AuthRestoreDto {
  @IsEmail()
  email: string;
  @Matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, { message: 'Phone is invalid' })
  phone: string;
}
