import { HttpBody, http, HttpNotFoundError, Response } from '@deepkit/http';

import { Task, TaskService } from '../app/task.service';
import { TaskParameterResolver } from '../app/task-parameter.resolver';

@http.controller('/tasks').group('task')
@http.resolveParameter(Task, TaskParameterResolver)
export class TaskControllerHttp {
  constructor(private taskService: TaskService) {}

  @http.POST()
  createOne({ title }: HttpBody<Pick<Task, 'title'>>): Task {
    return this.taskService.create(title);
  }

  @http.GET()
  listAll(): Task[] {
    return this.taskService.getAll();
  }

  @http.DELETE()
  deleteAll() {
    this.taskService.deleteAll();

    return new Response('', 'text/plain', 204);
  }

  @http.GET('/:id')
  getOne(task: Task): Task {
    return task;
  }

  @http.PATCH('/:id')
  updateOne(task: Task, changes: HttpBody<Partial<Omit<Task, 'id'>>>): Task {
    return this.taskService.update(task.id, changes)!;
  }

  @http.DELETE('/:id')
  deleteOne(task: Task) {
    this.taskService.delete(task.id);

    return new Response('', 'text/plain', 204);
  }
}
