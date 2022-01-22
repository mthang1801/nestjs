import { AuthProviderEnum } from '../helpers/enums/auth-provider.enum';

export class AuthProviderEntity {
  provider: string;
  provider_name: AuthProviderEnum;
  access_token: string;
  extra_data: string;
  created_at: Date;
}
