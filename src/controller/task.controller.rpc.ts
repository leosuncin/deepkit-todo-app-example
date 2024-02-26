import { rpc } from '@deepkit/rpc';

import { Task, TaskService } from '../app/task.service';

@rpc.controller('tasks')
export class TaskControllerRpc {
  constructor(private readonly taskService: TaskService) {}

  @rpc.action()
  addTask(title: Task['title']): Task {
    return this.taskService.create(title);
  }

  @rpc.action()
  listTasks(): Task[] {
    return this.taskService.getAll();
  }

  @rpc.action()
  getTask(id: Task['id']): Task | undefined {
    return this.taskService.get(id);
  }

  @rpc.action()
  editTask(
    id: Task['id'],
    changes: Partial<Omit<Task, 'id'>>,
  ): Task | undefined {
    return this.taskService.update(id, changes);
  }

  @rpc.action()
  removeTask(id: Task['id']): Task | undefined {
    return this.taskService.delete(id);
  }

  @rpc.action()
  clearTasks(): void {
    this.taskService.deleteAll();
  }
}
