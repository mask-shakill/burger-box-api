import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from '../../database/supabase.service';
import { GoogleLoginDto } from './dto/google-login.dto';

@Injectable()
export class AuthService {
  private googleClient = new OAuth2Client();

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private supabaseService: SupabaseService,
  ) {}

  async googleLogin(dto: GoogleLoginDto) {
    const { idToken, platform } = dto;

    console.log('ID Token:', idToken?.substring(0, 50) + '...');
    console.log('Platform:', platform);
    console.log('Client ID:', this.configService.get('GOOGLE_CLIENT_ID'));

    let ticket;
    try {
      ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: this.configService.getOrThrow('GOOGLE_CLIENT_ID'),
      });
    } catch (error) {
      console.error('Token verification failed:', error.message);
      throw new UnauthorizedException('Invalid Google ID token');
    }

    const payload = ticket.getPayload();
    if (!payload || !payload.email || !payload.email_verified) {
      throw new UnauthorizedException('Invalid or unverified Google account');
    }

    const { email, name, picture } = payload;

    let { data: user } = await this.supabaseService.client
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (!user) {
      const { data: newUser, error } = await this.supabaseService.client
        .from('users')
        .insert({
          email,
          name: name || email.split('@')[0],
          img_url: picture,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error || !newUser) {
        throw new UnauthorizedException('Failed to create user');
      }

      user = newUser;
    }

    const accessPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      img_url: user.img_url,
      platform,
    };

    const refreshPayload = {
      sub: user.id,
      type: 'refresh',
    };

    const access_token = await this.jwtService.signAsync(accessPayload, {
      expiresIn: '1h',
    });
    const refresh_token = await this.jwtService.signAsync(refreshPayload, {
      expiresIn: '7d',
    });

    return { access_token, refresh_token };
  }
}
