import { IsOptional, IsString } from 'class-validator';

export class saveAdminDto {
  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  image?: string;
}
