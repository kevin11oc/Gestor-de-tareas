import { Task } from 'src/tasks/tasks.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];
}
