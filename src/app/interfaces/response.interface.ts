export interface IResponseDataSuccess<T> {
  code: number;
  data: T | T[];
}

export interface IResponseError {
  code: number;
  message: string;
}

export interface IResponseErrorResponse {
  error: IResponseError;
}
