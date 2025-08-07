import Index from './Index';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { ConfigService } from '@nestjs/config';
import { RedisModule } from './common/redis/redis.module';

@Index.Module({
  imports: [
    Index.ConfigModule.forRoot({
      isGlobal: true,
    }),
    Index.TypeOrmModule.forRootAsync({
      imports: [Index.ConfigModule],
      inject: [Index.ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST') || 'localhost',
        port: parseInt(config.get<string>('DB_PORT') || '5432'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASS'),
        database: config.get<string>('DB_NAME'),
        synchronize: true,
        autoLoadEntities: true,
      }),
    }),
    UserModule,
    AdminModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
