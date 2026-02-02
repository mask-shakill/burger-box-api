import { IsString, IsNotEmpty, IsIn } from 'class-validator';
export class GoogleLoginDto {
  @IsString()
  @IsNotEmpty()
  idToken: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['web', 'mobile'])
  platform: 'web' | 'mobile';
}
