import { AuthProviderEnum } from '../enums/provider.enum';

export interface IAuthProvider {
  provider: string;
  provider_name: AuthProviderEnum;
  access_token: string;
  extra_data?: string;
  created_at: Date;
}
