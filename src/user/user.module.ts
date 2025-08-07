import Index from 'src/Index';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { CommonModule } from 'src/common/common.module';

@Index.Module({
  imports: [Index.TypeOrmModule.forFeature([User]), CommonModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
