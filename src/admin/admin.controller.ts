import Index from 'src/Index';
import { AdminService } from './admin.service';
import { saveAdminDto } from './dto/save-admin.dto';
import {
  LoginResponse,
  StandardResponse,
} from 'src/common/interfaces/interface';
import { Admin } from './admin.entity';
import { updateAdminDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-guard';
import type { RequestWithUser } from 'src/common/interfaces/interface';
import { FileUpload } from 'src/common/multer/upload.interceptor';

@Index.Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Index.Post('sign-up')
  async signUp(
    @Index.Body() body: saveAdminDto,
  ): Promise<StandardResponse<Admin>> {
    return this.adminService.signUp(body);
  }

  @Index.Post('login')
  async login(
    @Index.Body() body: saveAdminDto,
  ): Promise<StandardResponse<LoginResponse<Admin>>> {
    return this.adminService.login(body);
  }

  @Index.Post('edit-profile')
  @Index.UseGuards(JwtAuthGuard)
  @FileUpload()
  async editProfile(
    @Index.Body() body: updateAdminDto,
    @Index.Req() req: RequestWithUser,
    @Index.UploadedFile() file: Express.Multer.File,
  ): Promise<StandardResponse<Admin>> {
    const userId = req?.user?.id;
    const image = file?.filename;
    return this.adminService.editProfile(body, userId, image);
  }

  @Index.Post('forgot-password')
  async forgotPassword(
    @Index.Body() body: { email: string },
  ): Promise<StandardResponse<Admin>> {
    return this.adminService.forgotPassword(body);
  }
}
