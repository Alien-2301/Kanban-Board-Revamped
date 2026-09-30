// defining the shape of the data
// export type TodoStatus = 'Todo' | 'Progress'| 'Pending' | 'Done'

export enum TodoStatus
{
  Todo = 'Todo',
  InProgress = 'InProgress',
  Pending = 'Pending',
  Done = 'Done',
}
// shape of the data (interface for merge)
// camel case version of TodoItemDTO
export interface TodoItem {
  id: number;
  name: string;
  category?: string;
  status: TodoStatus;
  order: number;
  dueDate?: string | null;
  priority: number; // 1 = Low, 2 = Medium, 3 = High
  createdAt: string;
  completedAt?: string | null;
  notes?: string;
}

// interface for the patch method
export interface MoveRequest{
  status: TodoStatus;
  order: number;
}


export interface TodoColumn {
  id: string;         // 'todo', 'inProgress', 'done', 'blocked', ...
  title: string;      // 'To Do', 'In Progress', ...
  status: TodoStatus; // matches the backend enum
  items: TodoItem[];
}