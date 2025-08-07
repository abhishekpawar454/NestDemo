import Index from 'src/Index';

@Index.Entity()
export class User {
  @Index.PrimaryGeneratedColumn()
  id: number;

  @Index.Column()
  name: string;

  @Index.Column()
  email: string;

  @Index.Exclude()
  @Index.Column()
  password: string;

  @Index.Column({ default: true })
  isActive: boolean;

  @Index.Column({ default: false })
  isDeleted: boolean;

  @Index.CreateDateColumn()
  createdAt: Date;
}
