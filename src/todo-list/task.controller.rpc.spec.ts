import { createTestingApp } from '@deepkit/framework';
import { Logger, MemoryLoggerTransport } from '@deepkit/logger';
import { Database, MemoryDatabaseAdapter } from '@deepkit/orm';
import type { RemoteController, RpcClient } from '@deepkit/rpc';
import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';

import { TaskControllerRpc } from './task.controller.rpc';
import { Task } from './task.entity';
import { TaskService } from './task.service';

describe('TaskControllerRpc', () => {
  let testing: ReturnType<typeof createTestingApp>;
  let client: RpcClient;
  let controller: RemoteController<TaskControllerRpc>;

  beforeEach(async () => {
    testing = createTestingApp({
      controllers: [TaskControllerRpc],
      providers: [
        {
          provide: Logger,
          useValue: new Logger([new MemoryLoggerTransport()]),
        },
        {
          provide: Database,
          useFactory() {
            return new Database(new MemoryDatabaseAdapter(), [Task]);
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

    expect(result).toMatchObject({
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
    const task = await testing.app.get(TaskService).create('Hello World');
    const result = await controller.getTask(task.id);

    expect(result).toMatchObject({
      id: task.id,
      title: 'Hello World',
      completed: false,
    });
    expect(result).toBeInstanceOf(Task);
  });

  it('update a task when given a valid identifier', async () => {
    const task = await testing.app.get(TaskService).create('Hello World');
    const result = await controller.editTask(task.id, {
      title: 'Hello Deepkit',
      completed: true,
    });

    expect(result).toMatchObject({
      id: task.id,
      title: 'Hello Deepkit',
      completed: true,
    });
  });

  it('remove a task when given a valid identifier', async () => {
    const task = await testing.app.get(TaskService).create('Hello World');
    const result = await controller.removeTask(task.id);

    expect(result).toMatchObject({
      id: task.id,
      title: task.title,
      completed: task.completed,
    });
    await expect(
      testing.app.get(TaskService).get(task.id),
    ).resolves.toBeUndefined();
  });

  it('remove all of the tasks', async () => {
    const taskService = testing.app.get(TaskService);
    await taskService.create('Hello World');
    await taskService.create('Hello Deepkit');

    await expect(taskService.getAll()).resolves.toHaveLength(2);

    await controller.clearTasks();

    await expect(taskService.getAll()).resolves.toEqual([]);
  });
});
