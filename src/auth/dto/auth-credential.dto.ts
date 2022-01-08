import {
  IsString,
  IsEmail,
  Matches,
  MinLength,
  IsPhoneNumber,
} from 'class-validator';

export class AuthCredentialsDto {
  @IsString()
  @MinLength(6)
  name: string;
  @IsEmail()
  email: string;
  @IsString()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message:
      'Minimum eight characters, at least one letter, one number and one special character',
  })
  password: string;
  @Matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, { message: 'Phone is invalid' })
  phone: string;
}
