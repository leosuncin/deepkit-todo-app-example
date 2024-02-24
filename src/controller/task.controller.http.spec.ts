import { createTestingApp } from '@deepkit/framework';
import { HttpRequest } from '@deepkit/http';
import { describe, expect, it } from '@jest/globals';

import { TaskParameterResolver } from '../app/task-parameter.resolver';
import { TaskService } from '../app/task.service';
import { TaskControllerHttp } from './task.controller.http';

describe('TaskControllerHttp', () => {
  it('create a task', async () => {
    const testing = createTestingApp({
      controllers: [TaskControllerHttp],
      providers: [TaskService, TaskParameterResolver],
    });

    await testing.startServer();

    try {
      const response = await testing.request(
        HttpRequest.POST('/tasks').json({ title: 'New Task' }),
      );

      expect(response.statusCode).toBe(200);
      expect(response.json).toMatchObject({ title: 'New Task' });
    } finally {
      await testing.stopServer();
    }
  });

  it('list all tasks', async () => {
    const testing = createTestingApp({
      controllers: [TaskControllerHttp],
      providers: [TaskService, TaskParameterResolver],
    });

    await testing.startServer();

    try {
      const response = await testing.request(HttpRequest.GET('/tasks'));

      expect(response.statusCode).toBe(200);
      expect(response.json).toMatchObject([]);
    } finally {
      await testing.stopServer();
    }
  });

  it('delete all tasks', async () => {
    const testing = createTestingApp({
      controllers: [TaskControllerHttp],
      providers: [TaskService, TaskParameterResolver],
    });

    await testing.startServer();

    try {
      const response = await testing.request(HttpRequest.DELETE('/tasks'));

      expect(response.statusCode).toBe(204);
    } finally {
      await testing.stopServer();
    }
  });

  it('get one task', async () => {
    const testing = createTestingApp({
      controllers: [TaskControllerHttp],
      providers: [TaskService, TaskParameterResolver],
    });

    await testing.startServer();

    try {
      const { id } = testing.app.get(TaskService).create('New Task');
      const response = await testing.request(HttpRequest.GET(`/tasks/${id}`));

      expect(response.statusCode).toBe(200);
    } finally {
      await testing.stopServer();
    }
  });

  it('update one task', async () => {
    const testing = createTestingApp({
      controllers: [TaskControllerHttp],
      providers: [TaskService, TaskParameterResolver],
    });

    await testing.startServer();

    try {
      const { id, completed } = testing.app.get(TaskService).create('New Task');
      const response = await testing.request(
        HttpRequest.PATCH(`/tasks/${id}`).json({ title: 'Updated Task' }),
      );

      expect(response.statusCode).toBe(200);
      expect(response.json).toMatchObject({
        id,
        completed,
        title: 'Updated Task',
      });
    } finally {
      await testing.stopServer();
    }
  });

  it('delete one task', async () => {
    const testing = createTestingApp({
      controllers: [TaskControllerHttp],
      providers: [TaskService, TaskParameterResolver],
    });

    await testing.startServer();

    try {
      const { id } = testing.app.get(TaskService).create('New Task');
      const response = await testing.request(
        HttpRequest.DELETE(`/tasks/${id}`),
      );

      expect(response.statusCode).toBe(204);
    } finally {
      await testing.stopServer();
    }
  });
});
