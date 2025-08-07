import { IsEmail, IsOptional, IsString } from 'class-validator';

export class updateAdminDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  image: string;

  @IsOptional()
  @IsString()
  password: string;
}
