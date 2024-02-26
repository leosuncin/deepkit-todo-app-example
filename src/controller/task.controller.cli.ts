import { Command, cli } from '@deepkit/app';
import { Logger } from '@deepkit/logger';

import { Task } from '../app/task.entity';
import { TaskService } from '../app/task.service';

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

@cli.controller('task:create')
export class TaskCreateCommand implements Command {
  constructor(
    private taskService: TaskService,
    private logger: Logger,
  ) {}

  async execute(title: Task['title']): Promise<void> {
    const task = await this.taskService.create(title);
    this.logger.log(JSON.stringify(task, null, 2));
  }
}
