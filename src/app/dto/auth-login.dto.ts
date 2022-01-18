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
      'Mật khẩu không hợp lệ, ít nhất phải có 8 ký tự gồm chữ thường, chữ in hoa, số và ký tự đặc biệt.',
  })
  password: string;
}
