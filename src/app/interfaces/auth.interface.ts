import { AuthProviderEnum } from '../helpers/enums/auth-provider.enum';

export interface IAuthProvider {
  provider: string;
  provider_name: AuthProviderEnum;
  access_token: string;
  extra_data?: string;
  created_at: Date;
}

export interface IRegister {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  phone: string;
}

export interface IAuthToken {
  access_token: string;
}

export interface IAuthResult {
  status: number;
  access_token?: string;
  message?: string | any;
}
