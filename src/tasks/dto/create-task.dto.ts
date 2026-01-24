export class CreateTaskDto {
  title: string;
  description: string;
  status?: string;
  priority?: string;
  category?: string;
  tags?: string[];
  dueDate?: Date;
}
