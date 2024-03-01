import { rpc } from '@deepkit/rpc';

import { Task } from './task.entity';
import { TaskService } from './task.service';

@rpc.controller('tasks')
export class TaskControllerRpc {
  constructor(private readonly taskService: TaskService) {}

  @rpc.action()
  addTask(title: Task['title']): Promise<Task> {
    return this.taskService.create(title);
  }

  @rpc.action()
  listTasks(): Promise<Task[]> {
    return this.taskService.getAll();
  }

  @rpc.action()
  getTask(id: Task['id']): Promise<Task | undefined> {
    return this.taskService.get(id);
  }

  @rpc.action()
  editTask(
    id: Task['id'],
    changes: Partial<Omit<Task, 'id'>>,
  ): Promise<Task | undefined> {
    return this.taskService.update(id, changes);
  }

  @rpc.action()
  removeTask(id: Task['id']): Promise<Task | undefined> {
    return this.taskService.delete(id);
  }

  @rpc.action()
  clearTasks(): Promise<void> {
    return this.taskService.deleteAll();
  }
}
