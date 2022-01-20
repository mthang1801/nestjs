import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID:
        '1000906918287-cpjqf7q1h6l1f1dpfjnfrcapg5v2qj4j.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: '/be/v1/auth/google/callback',
      scope: ['profile', 'email', 'openid'],
      response_type: 'id_token permission',
      accessType: 'offline',
      prompt: 'consent',
    });
  }

  authorizationParams(): { [key: string]: string } {
    return {
      access_type: 'offline',
    };
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const {
      id,
      displayName,
      name: { familyName, givenName },
      emails,
      photos,
    } = profile;

    const email = emails[0].value;
    const avatar = photos[0].value;
    console.log(profile, accessToken, refreshToken);
    const user = {
      id,
      displayName,
      familyName,
      givenName,
      email,
      avatar,
      accessToken,
      refreshToken,
    };
    done(null, user);
  }
}
