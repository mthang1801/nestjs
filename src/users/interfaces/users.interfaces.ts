export interface IUser {
  name: string;
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
