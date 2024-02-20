import { Command, cli } from '@deepkit/app';
import { Logger } from '@deepkit/logger';

import { TaskService } from '../app/task.service';

@cli.controller('task:list')
export class TaskListCommand implements Command {
  constructor(
    private taskService: TaskService,
    private logger: Logger,
  ) {}

  execute() {
    const tasks = this.taskService.getAll();
    this.logger.log(tasks);
  }
}
