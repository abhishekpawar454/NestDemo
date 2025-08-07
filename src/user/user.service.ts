import Index from 'src/Index';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { SaveUserDto } from './dto/save-user.dto';
import ResponseMessage from 'src/ResponseMessage';
import { StandardResponse } from 'src/common/interfaces/interface';
import { PasswordService } from 'src/common/utils/password.service';
import { Inject } from '@nestjs/common';
import Redis from 'ioredis';

@Index.Injectable()
export class UserService {
  private cacheKey = 'allUsers';

  constructor(
    @Index.InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly passwordService: PasswordService,

    @Inject('REDIS_CLIENT')
    private readonly redis: Redis,
  ) {}

  async createOrUpdate(userData: SaveUserDto): Promise<StandardResponse<User>> {
    if (userData?.id) {
      const user = await this.userRepository.findOne({
        where: { id: userData?.id, isDeleted: false },
      });
      if (!user) {
        throw new Index.NotFoundException(ResponseMessage.USER_NOT_FOUND);
      }
      if (userData?.email) {
        const emailConflict = await this.userRepository.findOne({
          where: { email: userData.email, isDeleted: false },
        });
        if (emailConflict && emailConflict.id !== user.id) {
          throw new Index.BadRequestException(
            ResponseMessage.EMAIL_ALREADY_EXIST,
          );
        }
      }
      const updatedUser = this.userRepository.merge(user, userData);
      const result = await this.userRepository.save(updatedUser);
      await this.redis.del(this.cacheKey);
      return Index.sendResponse<User>(
        Index.HttpStatus.OK,
        ResponseMessage.USER_UPDATED,
        result,
      );
    } else {
      if (!userData?.name || !userData?.email || !userData?.password) {
        throw new Index.BadRequestException(
          ResponseMessage.MISSING_REQUIRED_FIELDS,
        );
      }
      const user = await this.userRepository.findOne({
        where: { email: userData?.email, isDeleted: false },
      });
      if (user) {
        throw new Index.ConflictException(ResponseMessage.EMAIL_ALREADY_EXIST);
      }
      const hashedPassword = await this.passwordService.hash(
        userData?.password,
      );
      const newUserData = { ...userData, password: hashedPassword };
      const newUser = this.userRepository.create(newUserData);
      const result = await this.userRepository.save(newUser);
      await this.redis.del(this.cacheKey);
      return Index.sendResponse<User>(
        Index.HttpStatus.CREATED,
        ResponseMessage.USER_CREATED,
        result,
      );
    }
  }

  async findAll(id?: number): Promise<StandardResponse<User | User[]>> {
    if (id) {
      const result = await this.userRepository.findOne({
        where: { id, isDeleted: false },
      });
      if (!result) {
        throw new Index.NotFoundException(ResponseMessage.USER_NOT_FOUND);
      }
      return Index.sendResponse<User>(
        Index.HttpStatus.OK,
        ResponseMessage.USER_FETCHED,
        result,
      );
    }

    const cached = await this.redis.get(this.cacheKey);

    if (cached) {
      const users = JSON.parse(cached);
      return Index.sendResponse<User[]>(
        Index.HttpStatus.OK,
        ResponseMessage.USER_LIST_FETCHED,
        users,
      );
    }

    const result = await this.userRepository.find({
      where: { isDeleted: false },
    });

    await this.redis.set(this.cacheKey, JSON.stringify(result), 'EX', 600);

    return Index.sendResponse<User[]>(
      Index.HttpStatus.OK,
      ResponseMessage.USER_LIST_FETCHED,
      result,
    );
  }

  async delete(id: number): Promise<StandardResponse<User>> {
    const user = await this.userRepository.findOne({
      where: { id, isDeleted: false },
    });
    if (!user) {
      throw new Index.NotFoundException(ResponseMessage.USER_NOT_FOUND);
    }
    user.isDeleted = true;
    const result = await this.userRepository.save(user);
    await this.redis.del(this.cacheKey);
    return Index.sendResponse<User>(
      Index.HttpStatus.OK,
      ResponseMessage.USER_DELETED,
      result,
    );
  }

  async activeDeactive(id: number): Promise<StandardResponse<User>> {
    const user = await this.userRepository.findOne({
      where: { id, isDeleted: false },
    });
    if (!user) {
      throw new Index.NotFoundException(ResponseMessage.USER_NOT_FOUND);
    }
    user.isActive = !user.isActive;
    const result = await this.userRepository.save(user);
    await this.redis.del(this.cacheKey);
    const message = result.isActive
      ? ResponseMessage.USER_ACTIVATED
      : ResponseMessage.USER_DEACTIVATED;
    return Index.sendResponse<User>(Index.HttpStatus.OK, message, result);
  }
}
