import { IsEnum, IsNotEmpty, IsString, IsDateString } from 'class-validator';
import { TaskStatus } from '../tasks.entity';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsDateString()
  dueDate: Date;
}
