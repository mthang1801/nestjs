import { Module } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthController as AuthControllerBe } from '../controllers/be/auth.controller';
import { AuthController as AuthControllerFe } from '../controllers/fe/auth.controller';
import { UsersModule } from './users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../helpers/auth/strategies/jwt.strategy';
import { LocalStrategy } from '../helpers/auth/strategies/local.strategy';
import { GoogleStrategy } from '../helpers/auth/strategies/google.strategy';
import { FacebookStrategy } from '../helpers/auth/strategies/facebook.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthProviderRepository } from '../repositories/auth.repository';
@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwtSecretKey'),
        signOptions: { expiresIn: configService.get<string>('jwtExpiresIn') },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    GoogleStrategy,
    FacebookStrategy,
    AuthProviderRepository,
    String,
  ],
  exports: [AuthService],
  controllers: [AuthControllerBe, AuthControllerFe],
})
export class AuthModule {}
