import { describe, expect, it } from '@jest/globals';

import { TaskService } from './task.service';

describe('TaskService', () => {
  it('be defined', () => {
    expect(new TaskService()).toBeDefined();
  });

  it('create a task with a valid title and add it to the task list', () => {
    const service = new TaskService();
    const taskTitle = 'Valid Task Title';
    const task = service.create(taskTitle);

    expect(task).toEqual({
      id: expect.any(String),
      title: taskTitle,
      completed: false,
    });
  });

  it('get a task by its id and return the correct task', () => {
    const taskService = new TaskService();
    const taskTitle = 'Valid Task Title';
    const createdTask = taskService.create(taskTitle);

    const retrievedTask = taskService.get(createdTask.id);

    expect(retrievedTask).toBe(createdTask);
  });

  it('get all tasks and return all tasks in the task list', () => {
    const taskService = new TaskService();
    const taskTitle1 = 'Task 1';
    const taskTitle2 = 'Task 2';
    const createdTask1 = taskService.create(taskTitle1);
    const createdTask2 = taskService.create(taskTitle2);

    const allTasks = taskService.getAll();

    expect(allTasks).toContain(createdTask1);
    expect(allTasks).toContain(createdTask2);
  });

  it('get a task with an invalid id and return undefined', () => {
    const taskService = new TaskService();
    const invalidId = 'invalid-id';

    const retrievedTask = taskService.get(invalidId);

    expect(retrievedTask).toBeUndefined();
  });

  it.each([{ title: 'New title' }, { completed: true }])(
    'update a task with %j when given a valid id',
    (changes) => {
      const taskService = new TaskService();
      const task = taskService.create('Task 1');

      const updatedTask = taskService.update(task.id, changes);

      expect(updatedTask).toBeDefined();
      expect(updatedTask).toMatchObject(changes);
    },
  );

  it('not update a task when given an invalid id', () => {
    const taskService = new TaskService();
    const invalidId = 'invalid-id';
    const newTitle = 'New title';

    const updatedTask = taskService.update(invalidId, { title: newTitle });

    expect(updatedTask).not.toBeDefined();
  });

  it('delete an existing task by its id', () => {
    const taskService = new TaskService();
    const task = taskService.create('Task 1');

    expect(taskService.getAll()).toHaveLength(1);
    expect(taskService.delete(task.id)).toEqual(task);
    expect(taskService.getAll()).toHaveLength(0);
    expect(taskService.get(task.id)).toBeUndefined();
  });

  it('return undefined when trying to delete a non-existing task', () => {
    const taskService = new TaskService();
    const result = taskService.delete('non-existing-id');

    expect(result).toBeUndefined();
  });

  it('clear the list of tasks when called', () => {
    const taskService = new TaskService();
    taskService.create('Task 1');
    taskService.create('Task 2');
    taskService.create('Task 3');

    expect(taskService.getAll()).toHaveLength(3);

    taskService.deleteAll();

    expect(taskService.getAll()).toHaveLength(0);
  });
});
