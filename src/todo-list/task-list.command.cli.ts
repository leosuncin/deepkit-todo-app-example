import { Command, cli } from '@deepkit/app';
import { Logger } from '@deepkit/logger';

import { TaskService } from './task.service';

@cli.controller('task:list')
export class TaskListCommand implements Command {
  constructor(
    private taskService: TaskService,
    private logger: Logger,
  ) {}

  async execute(): Promise<void> {
    const tasks = await this.taskService.getAll();
    this.logger.log(tasks);
  }
}
