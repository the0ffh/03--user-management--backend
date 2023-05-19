import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  address: string;

  @Column({ unique: true })
  email: string;

  @Column()
  birthdate: string;
}
