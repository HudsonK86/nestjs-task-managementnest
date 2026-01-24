import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TaskHistoryService } from './task-history.service';

@Module({
  controllers: [TasksController],
  providers: [TasksService, TaskHistoryService],
  exports: [TasksService, TaskHistoryService],
})
export class TasksModule {}
