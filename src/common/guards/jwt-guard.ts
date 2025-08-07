import Index from 'src/Index';
import { AuthGuard } from '@nestjs/passport';

@Index.Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
