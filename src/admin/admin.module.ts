import Index from 'src/Index';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { Admin } from './admin.entity';
import { CommonModule } from 'src/common/common.module';

@Index.Module({
  imports: [Index.TypeOrmModule.forFeature([Admin]), CommonModule],
  providers: [AdminService],
  controllers: [AdminController],
  exports: [AdminService],
})
export class AdminModule {}
