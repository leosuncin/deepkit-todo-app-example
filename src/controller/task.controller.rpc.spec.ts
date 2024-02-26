import type { App } from '@deepkit/app';
import { createTestingApp, type TestingFacade } from '@deepkit/framework';
import { Logger, MemoryLoggerTransport } from '@deepkit/logger';
import type { RemoteController, RpcClient } from '@deepkit/rpc';
import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';

import { Task } from '../app/task.entity';
import { TaskService } from '../app/task.service';
import { TaskControllerRpc } from './task.controller.rpc';

describe('TaskControllerRpc', () => {
  let testing: TestingFacade<App<{ controllers: any[]; providers: any[] }>>;
  let client: RpcClient;
  let controller: RemoteController<TaskControllerRpc>;

  beforeEach(async () => {
    testing = createTestingApp({
      controllers: [TaskControllerRpc],
      providers: [
        {
          provide: Logger,
          useFactory() {
            return new Logger([new MemoryLoggerTransport()]);
          },
        },
        TaskService,
      ],
    });

    await testing.startServer();

    client = testing.createRpcClient();
    controller = client.controller<TaskControllerRpc>('tasks');
  });

  afterEach(async () => {
    await testing.stopServer();
  });

  it('create a new task', async () => {
    const result = await controller.addTask('Hello World');

    expect(result).toEqual({
      id: expect.any(String),
      title: 'Hello World',
      completed: false,
    });
  });

  it('return an array of tasks', async () => {
    const result = await controller.listTasks();

    expect(result).toEqual([]);
  });

  it('return a task when given a valid identifier', async () => {
    const task = testing.app.get(TaskService).create('Hello World');
    const result = await controller.getTask(task.id);

    expect(result).toEqual(task);
    expect(result).toBeInstanceOf(Task);
  });

  it('update a task when given a valid identifier', async () => {
    const task = testing.app.get(TaskService).create('Hello World');
    const result = await controller.editTask(task.id, {
      title: 'Hello Deepkit',
      completed: true,
    });

    expect(result).toEqual({
      id: task.id,
      title: 'Hello Deepkit',
      completed: true,
    });
  });

  it('remove a task when given a valid identifier', async () => {
    const task = testing.app.get(TaskService).create('Hello World');
    const result = await controller.removeTask(task.id);

    expect(result).toEqual(task);
    expect(testing.app.get(TaskService).get(task.id)).toBeUndefined();
  });

  it('remove all of the tasks', async () => {
    const taskService = testing.app.get(TaskService);
    taskService.create('Hello World');
    taskService.create('Hello Deepkit');

    expect(taskService.getAll()).toHaveLength(2);

    await controller.clearTasks();

    expect(taskService.getAll()).toEqual([]);
  });
});
