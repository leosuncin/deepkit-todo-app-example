import {
  HttpNotFoundError,
  RouteParameterResolverContext,
  RouteParameterResolver,
} from '@deepkit/http';

import { Task, TaskService } from './task.service';

export class TaskParameterResolver implements RouteParameterResolver {
  constructor(private readonly taskService: TaskService) {}

  resolve({ parameters }: RouteParameterResolverContext): Task {
    const task = this.taskService.get(parameters.id);

    if (!task) {
      throw new HttpNotFoundError('Task not found');
    }

    return task;
  }
}
