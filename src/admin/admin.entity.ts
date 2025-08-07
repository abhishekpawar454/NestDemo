import Index from 'src/Index';

@Index.Entity()
export class Admin {
  @Index.PrimaryGeneratedColumn()
  id: number;

  @Index.Column()
  email: string;

  @Index.Exclude()
  @Index.Column()
  password: string;

  @Index.Column({ nullable: true })
  @Index.IsOptional()
  name: string;

  @Index.Column({ nullable: true })
  @Index.IsOptional()
  image: string;

  @Index.Column({ nullable: true })
  @Index.IsOptional()
  otp: number;

  @Index.CreateDateColumn()
  createdAt: Date;
}
