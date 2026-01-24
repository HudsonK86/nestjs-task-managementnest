export interface TaskHistory {
  id: string;
  taskId: string;
  action: TaskHistoryAction;
  field?: string;
  oldValue?: any;
  newValue?: any;
  timestamp: Date;
  description: string;
}

export enum TaskHistoryAction {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
  STATUS_CHANGED = 'STATUS_CHANGED',
  PRIORITY_CHANGED = 'PRIORITY_CHANGED',
  CATEGORY_CHANGED = 'CATEGORY_CHANGED',
  TAGS_CHANGED = 'TAGS_CHANGED',
}
