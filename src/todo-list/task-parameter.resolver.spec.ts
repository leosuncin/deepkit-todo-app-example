import { Database, MemoryDatabaseAdapter } from '@deepkit/orm';
import { describe, expect, it } from '@jest/globals';

import { TaskParameterResolver } from './task-parameter.resolver';
import { Task } from './task.entity';
import { TaskService } from './task.service';

describe('TaskParameterResolver', () => {
  let taskService: TaskService;
  let taskParameterResolver: TaskParameterResolver;

  beforeEach(() => {
    const database = new Database(new MemoryDatabaseAdapter(), [Task]);
    taskService = new TaskService(database);
    taskParameterResolver = new TaskParameterResolver(taskService);
  });

  it('can be defined', () => {
    expect(taskParameterResolver).toBeDefined();
  });

  it('resolve a task with a valid id', async () => {
    const task = await taskService.create('Valid Task Title');

    // @ts-expect-error Mock RouteParameterResolverContext
    const resolvedTask = await taskParameterResolver.resolve({
      parameters: { id: task.id },
    });

    expect(resolvedTask).toMatchObject({
      id: task.id,
      title: task.title,
      completed: task.completed,
    });
  });

  it('resolve a task with an invalid id and throw a Not Found error', async () => {
    await expect(
      // @ts-expect-error Mock RouteParameterResolverContext
      taskParameterResolver.resolve({ parameters: { id: 'invalid-id' } }),
    ).rejects.toThrowError('Task not found');
  });
});
