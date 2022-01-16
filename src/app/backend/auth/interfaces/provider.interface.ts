export interface GoogleProvider {
  id: number;
  access_token: string;
  refresh_token: string;
}

export interface FacebookProvider {
  id: number;
  access_token: string;
  refresh_token: string;
}

export enum AuthProvider {
  SYSTEM = 'SYSTEM',
  GOOGLE = 'GOOGLE',
  FACEBOOK = 'FACEBOOK',
}
