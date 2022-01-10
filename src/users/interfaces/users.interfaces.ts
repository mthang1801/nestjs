export interface IUser {
  displayName: string;
  email: string;
  password: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserInfo extends IUser {
  city: string;
  country: string;
  district: string;
  address: string;
}

export interface IUserConfirm {
  id: string;
  displayName: string;
  email: string;
}

export interface IUserRestorePwd extends IUser {
  verifyTokenExpAt: Date;
}
