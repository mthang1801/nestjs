import { AuthProviderEnum } from '../helpers/enums/auth_provider.enum';

export class AuthProviderEntity {
  user_id: number;
  provider: string;
  provider_name: AuthProviderEnum;
  access_token: string;
  extra_data: string;
  created_at: Date;
}
