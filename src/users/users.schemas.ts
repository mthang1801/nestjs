import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema()
export class User {
  @Prop({ required: true })
  displayName: string;
  @Prop({ required: true, unique: true })
  email: string;
  @Prop({ required: true })
  password: string;
  @Prop({ required: true })
  phone: string;
  @Prop({ default: '' })
  verifyToken: string;
  @Prop({ default: null })
  verifyTokenExpAt: Date;
  @Prop({ default: '' })
  city: string;
  @Prop({ default: '' })
  country: string;
  @Prop({ default: '' })
  district: string;
  @Prop({ default: '' })
  address: string;
  @Prop({ default: new Date() })
  createdAt: Date;
  @Prop({ default: new Date() })
  updatedAt: Date;
}

export type UserDocument = User & mongoose.Document;

export const UserSchema = SchemaFactory.createForClass(User);
