import { IsOptional, IsEnum, IsDateString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { TaskStatus } from '../tasks.entity';

export class FilterTasksDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}
