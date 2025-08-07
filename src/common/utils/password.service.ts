import Index from 'src/Index';

@Index.Injectable()
export class PasswordService {
  private readonly saltRounds = 10;

  async hash(password: string): Promise<string> {
    return await Index.hash(password, this.saltRounds);
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return await Index.compare(password, hashedPassword);
  }
}
