export interface IResponseData<T> {
  status_code: number;
  data: T | T[];
  message?: string;
}

export interface IResponseToken {
  code: number;
  [data: string]: any;
}

export interface IResponseMessage {
  status_code: number;
  message: string;
}

export interface IResponseDataSuccess<T> {
  code: number;
  data: T | T[];
}

export interface IResponseError {
  code: number;
  message: string;
}
