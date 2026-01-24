import { Injectable } from '@nestjs/common';
import {
  TaskHistory,
  TaskHistoryAction,
} from './interfaces/task-history.interface';

@Injectable()
export class TaskHistoryService {
  private history: TaskHistory[] = [];
  private historyIdCounter = 1;

  createHistory(
    taskId: string,
    action: TaskHistoryAction,
    description: string,
    field?: string,
    oldValue?: any,
    newValue?: any,
  ): TaskHistory {
    const historyEntry: TaskHistory = {
      id: this.historyIdCounter++.toString(),
      taskId,
      action,
      field,
      oldValue,
      newValue,
      timestamp: new Date(),
      description,
    };

    this.history.push(historyEntry);
    return historyEntry;
  }

  getTaskHistory(taskId: string): TaskHistory[] {
    return this.history
      .filter((entry) => entry.taskId === taskId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  getAllHistory(): TaskHistory[] {
    return this.history.sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
    );
  }

  getHistoryByAction(action: TaskHistoryAction): TaskHistory[] {
    return this.history
      .filter((entry) => entry.action === action)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  clearTaskHistory(taskId: string): void {
    this.history = this.history.filter((entry) => entry.taskId !== taskId);
  }
}
