import { Database, MemoryDatabaseAdapter } from '@deepkit/orm';
import { describe, expect, it } from '@jest/globals';

import { Task } from './task.entity';
import { TaskService } from './task.service';

describe('TaskService', () => {
  let taskService: TaskService;

  beforeEach(() => {
    const database = new Database(new MemoryDatabaseAdapter(), [Task]);
    taskService = new TaskService(database);
  });

  it('be defined', () => {
    expect(taskService).toBeDefined();
  });

  it('create a task with a valid title and add it to the task list', async () => {
    const taskTitle = 'Valid Task Title';
    const task = await taskService.create(taskTitle);

    expect(task).toBeDefined();
    expect(task).toMatchObject({
      id: expect.any(String),
      title: taskTitle,
      completed: false,
    });
    expect(task).toBeInstanceOf(Task);
  });

  it('get a task by its id and return the correct task', async () => {
    const taskTitle = 'Valid Task Title';
    const createdTask = await taskService.create(taskTitle);

    const retrievedTask = await taskService.get(createdTask.id);

    expect(retrievedTask).toBeDefined();
    expect(retrievedTask!.id).toBe(createdTask.id);
    expect(retrievedTask!.title).toBe(createdTask.title);
    expect(retrievedTask!.completed).toBe(createdTask.completed);
  });

  it('get all tasks and return all tasks in the task list', async () => {
    const createdTask1 = await taskService.create('Task 1');
    const createdTask2 = await taskService.create('Task 2');

    const allTasks = await taskService.getAll();

    expect(allTasks).toHaveLength(2);
    expect(allTasks.find(({ id }) => id === createdTask1.id)).toMatchObject({
      id: createdTask1.id,
      title: createdTask1.title,
      completed: createdTask1.completed,
    });
    expect(allTasks.find(({ id }) => id === createdTask2.id)).toMatchObject({
      id: createdTask2.id,
      title: createdTask2.title,
      completed: createdTask2.completed,
    });
  });

  it('get a task with an invalid id and return undefined', async () => {
    const invalidId = 'invalid-id';

    const retrievedTask = await taskService.get(invalidId);

    expect(retrievedTask).toBeUndefined();
  });

  it.each([{ title: 'New title' }, { completed: true }])(
    'update a task with %j when given a valid id',
    async (changes) => {
      const task = await taskService.create('Task 1');

      const updatedTask = await taskService.update(task.id, changes);

      expect(updatedTask).toBeDefined();
      expect(updatedTask).toMatchObject(changes);
    },
  );

  it('not update a task when given an invalid id', async () => {
    const invalidId = 'invalid-id';
    const newTitle = 'New title';

    const updatedTask = await taskService.update(invalidId, {
      title: newTitle,
    });

    expect(updatedTask).not.toBeDefined();
  });

  it('delete an existing task by its id', async () => {
    const task = await taskService.create('Task 1');

    await expect(taskService.getAll()).resolves.toHaveLength(1);
    await expect(taskService.delete(task.id)).resolves.toMatchObject({
      id: task.id,
      title: task.title,
      completed: task.completed,
    });
    await expect(taskService.getAll()).resolves.toHaveLength(0);
    await expect(taskService.get(task.id)).resolves.toBeUndefined();
  });

  it('return undefined when trying to delete a non-existing task', async () => {
    const result = await taskService.delete('non-existing-id');

    expect(result).toBeUndefined();
  });

  it('clear the list of tasks when called', async () => {
    await taskService.create('Task 1');
    await taskService.create('Task 2');
    await taskService.create('Task 3');

    await expect(taskService.getAll()).resolves.toHaveLength(3);

    await taskService.deleteAll();

    await expect(taskService.getAll()).resolves.toHaveLength(0);
  });
});
