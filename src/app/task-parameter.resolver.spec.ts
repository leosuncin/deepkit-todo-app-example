import { describe, expect, it } from '@jest/globals';

import { TaskParameterResolver } from './task-parameter.resolver';
import { TaskService } from './task.service';

describe('TaskParameterResolver', () => {
  it('can be defined', () => {
    expect(new TaskParameterResolver(new TaskService())).toBeDefined();
  });

  it('resolve a task with a valid id', () => {
    const taskService = new TaskService();
    const task = taskService.create('Valid Task Title');
    const taskParameterResolver = new TaskParameterResolver(taskService);

    // @ts-expect-error Mock RouteParameterResolverContext
    const resolvedTask = taskParameterResolver.resolve({
      parameters: { id: task.id },
    });

    expect(resolvedTask).toBe(task);
  });

  it('resolve a task with an invalid id and throw a Not Found error', () => {
    const taskService = new TaskService();
    const taskParameterResolver = new TaskParameterResolver(taskService);

    expect(() =>
      // @ts-expect-error Mock RouteParameterResolverContext
      taskParameterResolver.resolve({ parameters: { id: 'invalid-id' } }),
    ).toThrowError('Task not found');
  });
});
