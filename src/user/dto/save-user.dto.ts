import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SaveUserDto {
  @IsOptional()
  id?: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
