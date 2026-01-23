import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus, TaskPriority } from './interfaces/task.interface';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];
  private idCounter = 1;

  findAll(): Task[] {
    return this.tasks;
  }

  findOne(id: string): Task {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  create(createTaskDto: CreateTaskDto): Task {
    const task: Task = {
      id: this.idCounter++.toString(),
      title: createTaskDto.title,
      description: createTaskDto.description,
      status: (createTaskDto.status as TaskStatus) || TaskStatus.TODO,
      priority: (createTaskDto.priority as TaskPriority) || TaskPriority.MEDIUM,
      dueDate: createTaskDto.dueDate ? new Date(createTaskDto.dueDate) : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.tasks.push(task);
    return task;
  }

  update(id: string, updateTaskDto: UpdateTaskDto): Task {
    const task = this.findOne(id);

    if (updateTaskDto.title !== undefined) {
      task.title = updateTaskDto.title;
    }
    if (updateTaskDto.description !== undefined) {
      task.description = updateTaskDto.description;
    }
    if (updateTaskDto.status !== undefined) {
      task.status = updateTaskDto.status as TaskStatus;
    }
    if (updateTaskDto.priority !== undefined) {
      task.priority = updateTaskDto.priority as TaskPriority;
    }
    if (updateTaskDto.dueDate !== undefined) {
      task.dueDate = new Date(updateTaskDto.dueDate);
    }

    task.updatedAt = new Date();
    return task;
  }

  remove(id: string): void {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    this.tasks.splice(index, 1);
  }

  findByStatus(status: TaskStatus): Task[] {
    return this.tasks.filter((task) => task.status === status);
  }

  findByPriority(priority: TaskPriority): Task[] {
    return this.tasks.filter((task) => task.priority === priority);
  }

  getStatistics(): {
    total: number;
    byStatus: Record<TaskStatus, number>;
    byPriority: Record<TaskPriority, number>;
  } {
    const byStatus: Record<TaskStatus, number> = {
      [TaskStatus.TODO]: 0,
      [TaskStatus.IN_PROGRESS]: 0,
      [TaskStatus.DONE]: 0,
      [TaskStatus.CANCELLED]: 0,
    };

    const byPriority: Record<TaskPriority, number> = {
      [TaskPriority.LOW]: 0,
      [TaskPriority.MEDIUM]: 0,
      [TaskPriority.HIGH]: 0,
      [TaskPriority.URGENT]: 0,
    };

    this.tasks.forEach((task) => {
      byStatus[task.status]++;
      byPriority[task.priority]++;
    });

    return {
      total: this.tasks.length,
      byStatus,
      byPriority,
    };
  }
}
