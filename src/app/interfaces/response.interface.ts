import { IUser } from './users.interface';

export interface IResponse {
  code?: number;
  statusCode?: number;
  data?: any;
  message?: string;
}

export interface IResponseUserToken {
  token: string;
  userData: IUser;
}
