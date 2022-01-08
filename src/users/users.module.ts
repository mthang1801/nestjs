import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UserSchema } from '../users/users.schemas';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import * as bcrypt from 'bcrypt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWTSECRET,
      signOptions: { expiresIn: '10m' },
    }),
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory() {
          const schema = UserSchema;
          schema.pre('save', async function (next) {
            const user: any = this;
            if (user.isModified('password')) {
              user.password = await bcrypt.hash(user.password, 10);
            }
            next();
          });
          return schema;
        },
      },
    ]),
  ],
  exports: [UsersService],
  providers: [UsersService, JwtStrategy],
  controllers: [UsersController],
})
export class UsersModule {}
