import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import Index from 'src/Index';

@Index.Module({
  imports: [Index.ConfigModule],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      inject: [Index.ConfigService],
      useFactory: (config: ConfigService) => {
        return new Redis({
          host: config.get<string>('REDIS_HOST'),
          port: parseInt(config.get<string>('REDIS_PORT') || '6379'),
        });
      },
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
