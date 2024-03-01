import {
  HttpNotFoundError,
  RouteParameterResolver,
  RouteParameterResolverContext,
} from '@deepkit/http';

import { Task } from './task.entity';
import { TaskService } from './task.service';

export class TaskParameterResolver implements RouteParameterResolver {
  constructor(private readonly taskService: TaskService) {}

  async resolve({ parameters }: RouteParameterResolverContext): Promise<Task> {
    const task = await this.taskService.get(parameters.id);

    if (!task) {
      throw new HttpNotFoundError('Task not found');
    }

    return task;
  }
}
