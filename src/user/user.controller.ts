import Index from 'src/Index';
import { UserService } from './user.service';
import { User } from './user.entity';
import { SaveUserDto } from './dto/save-user.dto';
import { StandardResponse } from 'src/common/interfaces/interface';
import { JwtAuthGuard } from 'src/common/guards/jwt-guard';

@Index.Controller('admin')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Index.UseGuards(JwtAuthGuard)
  @Index.Post('create-update-user')
  async createOrUpdate(
    @Index.Body() body: SaveUserDto,
  ): Promise<StandardResponse<User>> {
    return this.userService.createOrUpdate(body);
  }

  @Index.UseGuards(JwtAuthGuard)
  @Index.Get('get-users')
  async getAllUsers(
    @Index.Query('id') id: number,
  ): Promise<StandardResponse<User | User[]>> {
    return this.userService.findAll(+id);
  }

  @Index.UseGuards(JwtAuthGuard)
  @Index.Get('delete-user/:id')
  async deleteUser(
    @Index.Param('id', Index.ParseIntPipe) id: number,
  ): Promise<StandardResponse<User>> {
    return this.userService.delete(id);
  }

  @Index.UseGuards(JwtAuthGuard)
  @Index.Get('active-deactive-user/:id')
  async activeDeactiveUser(
    @Index.Param('id', Index.ParseIntPipe) id: number,
  ): Promise<StandardResponse<User>> {
    return this.userService.activeDeactive(id);
  }
}
