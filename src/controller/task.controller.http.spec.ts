import { createTestingApp } from '@deepkit/framework';
import { HttpRequest } from '@deepkit/http';
import { Logger, MemoryLoggerTransport } from '@deepkit/logger';
import { Database, MemoryDatabaseAdapter } from '@deepkit/orm';
import { describe, expect, it } from '@jest/globals';

import { TaskParameterResolver } from '../app/task-parameter.resolver';
import { Task } from '../app/task.entity';
import { TaskService } from '../app/task.service';
import { TaskControllerHttp } from './task.controller.http';

describe('TaskControllerHttp', () => {
  let testing: ReturnType<typeof createTestingApp>;

  beforeEach(async () => {
    testing = createTestingApp({
      controllers: [TaskControllerHttp],
      providers: [
        {
          provide: Logger,
          useValue: new Logger([new MemoryLoggerTransport()]),
        },
        {
          provide: Database,
          useFactory: () => new Database(new MemoryDatabaseAdapter(), [Task]),
        },
        TaskService,
        TaskParameterResolver,
      ],
    });

    await testing.startServer();
  });

  afterEach(async () => {
    await testing.stopServer();
  });

  it('create a task', async () => {
    const response = await testing.request(
      HttpRequest.POST('/tasks').json({ title: 'New Task' }),
    );

    expect(response.statusCode).toBe(200);
    expect(response.json).toMatchObject({ title: 'New Task' });
  });

  it('list all tasks', async () => {
    const response = await testing.request(HttpRequest.GET('/tasks'));

    expect(response.statusCode).toBe(200);
    expect(response.json).toMatchObject([]);
  });

  it('delete all tasks', async () => {
    const response = await testing.request(HttpRequest.DELETE('/tasks'));

    expect(response.statusCode).toBe(204);
  });

  it('get one task', async () => {
    const { id } = await testing.app.get(TaskService).create('New Task');
    const response = await testing.request(HttpRequest.GET(`/tasks/${id}`));

    expect(response.statusCode).toBe(200);
  });

  it('update one task', async () => {
    const { id, completed } = await testing.app
      .get(TaskService)
      .create('New Task');
    const response = await testing.request(
      HttpRequest.PATCH(`/tasks/${id}`).json({ title: 'Updated Task' }),
    );

    expect(response.statusCode).toBe(200);
    expect(response.json).toMatchObject({
      id,
      completed,
      title: 'Updated Task',
    });
  });

  it('delete one task', async () => {
    const { id } = await testing.app.get(TaskService).create('New Task');
    const response = await testing.request(HttpRequest.DELETE(`/tasks/${id}`));

    expect(response.statusCode).toBe(204);
  });
});
