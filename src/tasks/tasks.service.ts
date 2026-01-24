import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus, TaskPriority } from './interfaces/task.interface';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskHistoryService } from './task-history.service';
import { TaskHistoryAction } from './interfaces/task-history.interface';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];
  private idCounter = 1;

  constructor(private readonly historyService: TaskHistoryService) {}

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
      category: createTaskDto.category,
      tags: createTaskDto.tags || [],
      dueDate: createTaskDto.dueDate ? new Date(createTaskDto.dueDate) : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.tasks.push(task);
    
    this.historyService.createHistory(
      task.id,
      TaskHistoryAction.CREATED,
      `Task "${task.title}" was created`,
    );

    return task;
  }

  update(id: string, updateTaskDto: UpdateTaskDto): Task {
    const task = this.findOne(id);

    if (updateTaskDto.title !== undefined && updateTaskDto.title !== task.title) {
      this.historyService.createHistory(
        id,
        TaskHistoryAction.UPDATED,
        `Task title changed from "${task.title}" to "${updateTaskDto.title}"`,
        'title',
        task.title,
        updateTaskDto.title,
      );
      task.title = updateTaskDto.title;
    }
    if (updateTaskDto.description !== undefined && updateTaskDto.description !== task.description) {
      this.historyService.createHistory(
        id,
        TaskHistoryAction.UPDATED,
        `Task description was updated`,
        'description',
        task.description,
        updateTaskDto.description,
      );
      task.description = updateTaskDto.description;
    }
    if (updateTaskDto.status !== undefined && updateTaskDto.status !== task.status) {
      this.historyService.createHistory(
        id,
        TaskHistoryAction.STATUS_CHANGED,
        `Task status changed from "${task.status}" to "${updateTaskDto.status}"`,
        'status',
        task.status,
        updateTaskDto.status,
      );
      task.status = updateTaskDto.status as TaskStatus;
    }
    if (updateTaskDto.priority !== undefined && updateTaskDto.priority !== task.priority) {
      this.historyService.createHistory(
        id,
        TaskHistoryAction.PRIORITY_CHANGED,
        `Task priority changed from "${task.priority}" to "${updateTaskDto.priority}"`,
        'priority',
        task.priority,
        updateTaskDto.priority,
      );
      task.priority = updateTaskDto.priority as TaskPriority;
    }
    if (updateTaskDto.category !== undefined && updateTaskDto.category !== task.category) {
      this.historyService.createHistory(
        id,
        TaskHistoryAction.CATEGORY_CHANGED,
        `Task category changed from "${task.category || 'none'}" to "${updateTaskDto.category}"`,
        'category',
        task.category,
        updateTaskDto.category,
      );
      task.category = updateTaskDto.category;
    }
    if (updateTaskDto.tags !== undefined) {
      const tagsChanged = JSON.stringify(task.tags.sort()) !== JSON.stringify(updateTaskDto.tags.sort());
      if (tagsChanged) {
        this.historyService.createHistory(
          id,
          TaskHistoryAction.TAGS_CHANGED,
          `Task tags changed from [${task.tags.join(', ')}] to [${updateTaskDto.tags.join(', ')}]`,
          'tags',
          task.tags,
          updateTaskDto.tags,
        );
        task.tags = updateTaskDto.tags;
      }
    }
    if (updateTaskDto.dueDate !== undefined) {
      const oldDueDate = task.dueDate?.toISOString();
      const newDueDate = new Date(updateTaskDto.dueDate).toISOString();
      if (oldDueDate !== newDueDate) {
        this.historyService.createHistory(
          id,
          TaskHistoryAction.UPDATED,
          `Task due date changed from "${oldDueDate || 'none'}" to "${newDueDate}"`,
          'dueDate',
          task.dueDate,
          new Date(updateTaskDto.dueDate),
        );
        task.dueDate = new Date(updateTaskDto.dueDate);
      }
    }

    task.updatedAt = new Date();
    return task;
  }

  remove(id: string): void {
    const task = this.findOne(id);
    const index = this.tasks.findIndex((t) => t.id === id);
    this.tasks.splice(index, 1);
    
    this.historyService.createHistory(
      id,
      TaskHistoryAction.DELETED,
      `Task "${task.title}" was deleted`,
    );
  }

  findByStatus(status: TaskStatus): Task[] {
    return this.tasks.filter((task) => task.status === status);
  }

  findByPriority(priority: TaskPriority): Task[] {
    return this.tasks.filter((task) => task.priority === priority);
  }

  search(query: string): Task[] {
    const lowerQuery = query.toLowerCase();
    return this.tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(lowerQuery) ||
        task.description.toLowerCase().includes(lowerQuery) ||
        task.category?.toLowerCase().includes(lowerQuery) ||
        task.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)),
    );
  }

  findByCategory(category: string): Task[] {
    return this.tasks.filter((task) => task.category === category);
  }

  findByTag(tag: string): Task[] {
    return this.tasks.filter((task) => task.tags.includes(tag));
  }

  getCategories(): string[] {
    const categories = new Set<string>();
    this.tasks.forEach((task) => {
      if (task.category) {
        categories.add(task.category);
      }
    });
    return Array.from(categories);
  }

  getTags(): string[] {
    const tags = new Set<string>();
    this.tasks.forEach((task) => {
      task.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags);
  }

  bulkUpdateStatus(ids: string[], status: TaskStatus): Task[] {
    const updatedTasks: Task[] = [];
    ids.forEach((id) => {
      try {
        const task = this.findOne(id);
        const oldStatus = task.status;
        task.status = status;
        task.updatedAt = new Date();
        updatedTasks.push(task);
        
        if (oldStatus !== status) {
          this.historyService.createHistory(
            id,
            TaskHistoryAction.STATUS_CHANGED,
            `Task status changed from "${oldStatus}" to "${status}" (bulk update)`,
            'status',
            oldStatus,
            status,
          );
        }
      } catch (error) {
        // Skip tasks that don't exist
      }
    });
    return updatedTasks;
  }

  bulkDelete(ids: string[]): { deleted: number; failed: number } {
    let deleted = 0;
    let failed = 0;

    ids.forEach((id) => {
      try {
        this.remove(id);
        deleted++;
      } catch (error) {
        failed++;
      }
    });

    return { deleted, failed };
  }

  getStatistics(): {
    total: number;
    byStatus: Record<TaskStatus, number>;
    byPriority: Record<TaskPriority, number>;
    byCategory: Record<string, number>;
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

    const byCategory: Record<string, number> = {};

    this.tasks.forEach((task) => {
      byStatus[task.status]++;
      byPriority[task.priority]++;
      if (task.category) {
        byCategory[task.category] = (byCategory[task.category] || 0) + 1;
      }
    });

    return {
      total: this.tasks.length,
      byStatus,
      byPriority,
      byCategory,
    };
  }
}
