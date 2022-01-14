import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-facebook';

export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor() {
    super({
      clientID: '308856844484646',
      clientSecret: '0580f9d35ccfd921a4f7ace6e545a6a8',
      callbackURL: '/auth/facebook/callback',
      scope: ['user_friends', 'email'],
      accessType: 'offline',
      prompt: 'consent',
      profileFields: ['id', 'emails', 'name', 'photos'],
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
      name: { displayName, familyName, givenName },
    } = profile;

    const email = profile.emails[0].value;
    const avatar = profile.photos[0].value;
    const user = {
      id,
      displayName: displayName || givenName + ' ' + familyName,
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
