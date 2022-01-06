import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { IUser } from './interfaces/user.interface';
import bcrypt from 'bcryptjs';
import { Document } from 'mongoose';
@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          schema.pre<IUser & Document>('save', async function (next) {
            let user = this;
            if (user.isModified('password')) {
              // user.password = await bcrypt.hash(user.password, 10);
            }
            next();
          });
          schema.methods = {
            toJSON() {
              const user = this;
              const userObject = user.toObject();
              delete userObject.password;
              return userObject;
            },
          };
          return schema;
        },
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
