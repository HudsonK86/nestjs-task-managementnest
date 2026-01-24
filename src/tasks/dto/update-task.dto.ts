import { IsString, IsOptional, IsArray, IsDateString, IsEnum, MinLength, MaxLength } from 'class-validator';
import { TaskStatus, TaskPriority } from '../interfaces/task.interface';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: string;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  category?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsDateString()
  dueDate?: Date;
}
