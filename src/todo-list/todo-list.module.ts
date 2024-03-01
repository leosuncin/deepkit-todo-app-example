import { createModule } from '@deepkit/app';

import { TaskParameterResolver } from './task-parameter.resolver';
import { TaskListCommand } from './task-list.command.cli';
import { TaskCreateCommand } from './task-create.command.cli';
import { TaskControllerHttp } from './task.controller.http';
import { TaskControllerRpc } from './task.controller.rpc';
import { TaskService } from './task.service';

export class TodoListModule extends createModule({
  providers: [TaskParameterResolver, TaskService],
  controllers: [
    TaskControllerHttp,
    TaskControllerRpc,
    TaskListCommand,
    TaskCreateCommand,
  ],
}) {}
