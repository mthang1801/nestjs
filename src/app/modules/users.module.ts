import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UsersController as UsersControllerBe } from '../controllers/be/users.controller';
import { UsersController as UsersControllerFe } from '../controllers/fe/users.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../helpers/auth/strategies/jwt.strategy';
import { MailModule } from './mail.module';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { UserProfileModule } from './user-profile.module';
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwtSecretKey'),
        signOptions: { expiresIn: configService.get<string>('jwtExpiresIn') },
      }),
      inject: [ConfigService],
    }),
    MailModule,
    UserProfileModule,
  ],
  exports: [UsersService],
  providers: [UsersService, JwtStrategy],
  controllers: [UsersControllerBe, UsersControllerFe],
})
export class UsersModule {}
