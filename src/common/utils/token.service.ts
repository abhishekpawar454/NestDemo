import Index from 'src/Index';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../interfaces/interface';

@Index.Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  async generateToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}
