import Index from 'src/Index';
import { Admin } from './admin.entity';
import { Repository } from 'typeorm';
import { saveAdminDto } from './dto/save-admin.dto';
import {
  LoginResponse,
  StandardResponse,
} from 'src/common/interfaces/interface';
import ResponseMessage from 'src/ResponseMessage';
import { PasswordService } from 'src/common/utils/password.service';
import { TokenService } from 'src/common/utils/token.service';
import { updateAdminDto } from './dto/update-profile.dto';
import { EmailService } from 'src/common/utils/email.service';

@Index.Injectable()
export class AdminService {
  constructor(
    @Index.InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
    private readonly emailService: EmailService,
  ) {}

  async signUp(data: saveAdminDto): Promise<StandardResponse<Admin>> {
    const hashedPassword = await this.passwordService.hash(data?.password);
    const updatedData = { ...data, password: hashedPassword };
    const admin = this.adminRepository.create(updatedData);
    const result = await this.adminRepository.save(admin);
    return Index.sendResponse(
      Index.HttpStatus.CREATED,
      ResponseMessage.ADMIN_CREATED,
      result,
    );
  }

  async login(
    data: saveAdminDto,
  ): Promise<StandardResponse<LoginResponse<Admin>>> {
    const findAdmin = await this.adminRepository.findOne({
      where: { email: data?.email },
    });
    if (!findAdmin) {
      throw new Index.ConflictException(ResponseMessage.INVALID_CREDENTIALS);
    }
    const checkPassword = await this.passwordService.compare(
      data?.password,
      findAdmin?.password,
    );
    if (!checkPassword) {
      throw new Index.ConflictException(ResponseMessage.INCORRECT_PASSWORD);
    }
    const token = await this.tokenService.generateToken({
      id: findAdmin?.id,
      email: findAdmin?.email,
    });
    const adminInstance = Index.plainToInstance(Admin, findAdmin);
    const admin = { ...adminInstance, token };
    return Index.sendResponse(
      Index.HttpStatus.OK,
      ResponseMessage.ADMIN_LOGGED_IN,
      admin,
    );
  }

  async editProfile(
    data: updateAdminDto,
    userId: number,
    image?: string,
  ): Promise<StandardResponse<Admin>> {
    const admin = await this.adminRepository.findOne({
      where: { id: userId },
    });
    if (!admin) {
      throw new Index.NotFoundException(ResponseMessage.ADMIN_NOT_FOUND);
    }
    Object.assign(admin, data);
    if (image) {
      admin.image = image;
    }
    const result = await this.adminRepository.save(admin);
    return Index.sendResponse(
      Index.HttpStatus.OK,
      ResponseMessage.ADMIN_UPDATED,
      result,
    );
  }

  async forgotPassword(data: {
    email: string;
  }): Promise<StandardResponse<Admin>> {
    const admin = await this.adminRepository.findOne({
      where: { email: data?.email },
    });
    if (!admin) {
      throw new Index.NotFoundException(ResponseMessage.ADMIN_NOT_FOUND);
    }
    const otp = Math.floor(1000 + Math.random() * 9000);
    admin.otp = otp;
    await this.adminRepository.save(admin);
    await this.emailService.forgotPasswordMail(data?.email, otp);
    return Index.sendResponse(Index.HttpStatus.OK, ResponseMessage.OTP_SENT);
  }
}
