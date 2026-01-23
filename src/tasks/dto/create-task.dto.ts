export class CreateTaskDto {
  title: string;
  description: string;
  status?: string;
  priority?: string;
  dueDate?: Date;
}
