export interface IUser {
  displayName: string;
  email: string;
  password: string;
  phone: string;
  city: string;
  country: string;
  district: string;
  address: string;
  verifyToken: string;
  verifyTokenExpAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserConfirm {
  id: string;
  displayName: string;
  email: string;
}

export interface IUserRestorePwd extends IUser {
  verifyTokenExpAt: Date;
}
