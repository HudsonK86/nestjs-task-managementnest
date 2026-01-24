import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskHistoryService } from './task-history.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskStatus, TaskPriority } from './interfaces/task.interface';
import { TaskHistoryAction } from './interfaces/task-history.interface';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly historyService: TaskHistoryService,
  ) {}

  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('priority') priority?: string,
    @Query('category') category?: string,
    @Query('tag') tag?: string,
    @Query('search') search?: string,
  ): Task[] {
    if (search) {
      return this.tasksService.search(search);
    }
    if (status) {
      return this.tasksService.findByStatus(status as TaskStatus);
    }
    if (priority) {
      return this.tasksService.findByPriority(priority as TaskPriority);
    }
    if (category) {
      return this.tasksService.findByCategory(category);
    }
    if (tag) {
      return this.tasksService.findByTag(tag);
    }
    return this.tasksService.findAll();
  }

  @Get('statistics')
  getStatistics() {
    return this.tasksService.getStatistics();
  }

  @Get('categories')
  getCategories(): string[] {
    return this.tasksService.getCategories();
  }

  @Get('tags')
  getTags(): string[] {
    return this.tasksService.getTags();
  }

  @Get('history')
  getHistory(@Query('action') action?: string) {
    if (action) {
      return this.historyService.getHistoryByAction(action as TaskHistoryAction);
    }
    return this.historyService.getAllHistory();
  }

  @Get(':id/history')
  getTaskHistory(@Param('id') id: string) {
    return this.historyService.getTaskHistory(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Task {
    return this.tasksService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTaskDto: CreateTaskDto): Task {
    return this.tasksService.create(createTaskDto);
  }

  @Post('bulk/update-status')
  @HttpCode(HttpStatus.OK)
  bulkUpdateStatus(
    @Body() body: { ids: string[]; status: TaskStatus },
  ): Task[] {
    return this.tasksService.bulkUpdateStatus(body.ids, body.status);
  }

  @Post('bulk/delete')
  @HttpCode(HttpStatus.OK)
  bulkDelete(@Body() body: { ids: string[] }): { deleted: number; failed: number } {
    return this.tasksService.bulkDelete(body.ids);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto): Task {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): void {
    return this.tasksService.remove(id);
  }
}
