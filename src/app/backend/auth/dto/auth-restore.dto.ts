import { IsString, Matches } from 'class-validator';

export class AuthRestoreDto {
  user_id: number;
  token: string;
  @IsString()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message:
      'Password at least eight characters, including one letter, one number and one special character',
  })
  password: string;
}
