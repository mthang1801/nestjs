import { AuthProviderEnum } from './enums/provider.enum';

export class AuthProvider {
  provider: string;
  provider_name: AuthProviderEnum;
  access_token: string;
  extra_data: string;
  created_at: Date;
}
