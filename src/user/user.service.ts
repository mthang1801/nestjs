import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { IUser } from './interfaces/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { User as UserModel, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
@Injectable()
export class UserService {
  users = [];
  constructor(
    @InjectModel(UserModel.name) private userModel: Model<UserDocument>,
  ) {}
  async findAll(): Promise<IUser[]> {
    return this.userModel.find();
  }
  async createUser(createUserDto: CreateUserDto): Promise<IUser> {
    const newUser = new this.userModel({
      ...createUserDto,
    });
    await newUser.save();
    return newUser;
  }
}
