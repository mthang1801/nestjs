export class User {
  id: number;
  facebook_access_id: number;
  google_access_id: number;
  email: string;
  displayName: string;
  password: string;
  firstName: string;
  lastName: string;
  avatar: string;
  // Contact Information
  phone: string;
  city: string;
  country: string;
  district: string;
  address: string;
  // Token to verification
  verifyToken: string;
  provider: string;
  verifyTokenExpAt: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}
