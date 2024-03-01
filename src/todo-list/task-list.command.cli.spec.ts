import { createTestingApp } from '@deepkit/framework';
import { Logger, MemoryLoggerTransport } from '@deepkit/logger';
import { Database, MemoryDatabaseAdapter } from '@deepkit/orm';
import { expect, test } from '@jest/globals';

import { TaskListCommand } from './task-list.command.cli';
import { Task } from './task.entity';
import { TaskService } from './task.service';

test('task:list command', async () => {
  const memoryLogger = new MemoryLoggerTransport();
  const testing = createTestingApp({
    controllers: [TaskListCommand],
    providers: [
      {
        provide: Logger,
        useValue: new Logger([memoryLogger]),
      },
      {
        provide: Database,
        useFactory: () => new Database(new MemoryDatabaseAdapter(), [Task]),
      },
      TaskService,
    ],
  });

  await expect(testing.app.execute(['task:list'])).resolves.toBe(0);
  expect(memoryLogger.messages[0]).toMatchObject({
    message: '[]',
  });
});
