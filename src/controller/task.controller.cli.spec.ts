import { createTestingApp } from '@deepkit/framework';
import { Logger, MemoryLoggerTransport } from '@deepkit/logger';
import { expect, test } from '@jest/globals';

import { TaskService } from '../app/task.service';
import { TaskCreateCommand, TaskListCommand } from './task.controller.cli';

test('task:list command', async () => {
  const memoryLogger = new MemoryLoggerTransport();
  const testing = createTestingApp({
    controllers: [TaskListCommand],
    providers: [TaskService],
  });
  testing.app.get(Logger).setTransport([memoryLogger]);

  await expect(testing.app.execute(['task:list'])).resolves.toBe(0);
  expect(memoryLogger.messages[0]).toMatchObject({
    message: '[]',
  });
});

test('task:create command', async () => {
  const memoryLogger = new MemoryLoggerTransport();
  const testing = createTestingApp({
    controllers: [TaskCreateCommand],
    providers: [TaskService],
  });
  testing.app.get(Logger).setTransport([memoryLogger]);

  await expect(testing.app.execute(['task:create', 'To do'])).resolves.toBe(0);
  expect(JSON.parse(memoryLogger.messages[0].message)).toMatchObject({
    id: expect.any(String),
    title: 'To do',
    completed: false,
  });

  await expect(testing.app.execute(['task:create', 'no'])).resolves.toBe(1);
  expect(memoryLogger.messages[1].message).toMatch(
    'Invalid value for argument title: no. Min length is 3',
  );
});
