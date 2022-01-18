export interface IResponseData<T> {
  status_code: number;
  data: T | T[];
  message?: string;
}

export interface IResponseToken {
  status_code: number;
  access_token: string;
}

export interface IResponseMessage {
  status_code: number;
  message: string;
}
