import { HttpBody, Response, http } from '@deepkit/http';

import { TaskParameterResolver } from './task-parameter.resolver';
import { Task } from './task.entity';
import { TaskService } from './task.service';

@http.controller('/tasks').group('task')
@http.resolveParameter(Task, TaskParameterResolver)
export class TaskControllerHttp {
  constructor(private taskService: TaskService) {}

  @http.POST()
  createOne({ title }: HttpBody<Pick<Task, 'title'>>): Promise<Task> {
    return this.taskService.create(title);
  }

  @http.GET()
  listAll(): Promise<Task[]> {
    return this.taskService.getAll();
  }

  @http.DELETE()
  async deleteAll(): Promise<Response> {
    await this.taskService.deleteAll();

    return new Response('', 'text/plain', 204);
  }

  @http.GET('/:id')
  getOne(task: Task): Task {
    return task;
  }

  @http.PATCH('/:id')
  updateOne(
    task: Task,
    changes: HttpBody<Partial<Omit<Task, 'id'>>>,
  ): Promise<Task> {
    return this.taskService.update(task.id, changes) as Promise<Task>;
  }

  @http.DELETE('/:id')
  async deleteOne(task: Task): Promise<Response> {
    await this.taskService.delete(task.id);

    return new Response('', 'text/plain', 204);
  }
}
