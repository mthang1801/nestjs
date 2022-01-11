export interface User {
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
