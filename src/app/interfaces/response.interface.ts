export interface IResponseDataSuccess<T> {
  code?: number;
  statusCode?: number;
  data: T | T[];
  message?: string;
  success: boolean;
}

export interface IResponseError {
  code?: number;
  data?: any;
  message: string;
  success: boolean;
}

export interface IResponseErrorResponse {
  error: IResponseError;
}
