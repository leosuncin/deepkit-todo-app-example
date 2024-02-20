import { createTestingApp } from '@deepkit/framework';
import { Logger, MemoryLoggerTransport } from '@deepkit/logger';
import { expect, test } from '@jest/globals';

import { TaskService } from '../app/task.service';
import { TaskListCommand } from './task.controller.cli';

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
