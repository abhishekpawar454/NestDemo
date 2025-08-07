import Index from 'src/Index';
import { TokenService } from './utils/token.service';
import { PasswordService } from './utils/password.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './guards/jwt-strategy';
import { ConfigService } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';
import { EmailService } from './utils/email.service';

@Index.Module({
  imports: [
    Index.ConfigModule,
    JwtModule.registerAsync({
      imports: [Index.ConfigModule],
      inject: [Index.ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
        },
      }),
    }),
    RedisModule,
  ],
  providers: [PasswordService, TokenService, JwtStrategy, EmailService],
  exports: [
    PasswordService,
    TokenService,
    JwtStrategy,
    JwtModule,
    RedisModule,
    EmailService,
  ],
})
export class CommonModule {}
