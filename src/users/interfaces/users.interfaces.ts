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

export interface UserAuthGoogle {
  id: string;
  displayName: string;
  familyName: string;
  givenName: string;
  email: string;
  avatar: string;
  phone: string;
  accessToken: string;
  refreshToken: string;
}

export interface NewUserAuthGoogle {
  email: string;
  googleId: string;
  displayName: string;
  firstName: string;
  lastName: string;
  avatar: string;
  password: string;
  phone: string;
}
