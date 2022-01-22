import { IsNotEmpty } from 'class-validator';

export class AuthLoginProviderDto {
  @IsNotEmpty()
  google_id: string;

  @IsNotEmpty()
  familyName: string;

  @IsNotEmpty()
  givenName: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  imageUrl: string;

  @IsNotEmpty()
  accessToken: string;
}
