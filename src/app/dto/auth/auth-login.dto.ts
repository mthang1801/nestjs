import { IsOptional, IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class LoginDto {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @Matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, { message: 'Phone is invalid' })
  phone: string;

  @IsNotEmpty()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message:
      'Password need to get minimum eight characters, at least one letter, one number and one special character:',
  })
  password: string;
}
