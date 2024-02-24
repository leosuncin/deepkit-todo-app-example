import { MinLength, Partial, UUID, uuid } from '@deepkit/type';

export class Task {
  id!: UUID;
  title!: string & MinLength<3>;
  completed!: boolean;
}

export class TaskService {
  #tasks = new Map<UUID, Task>();

  create(title: Task['title']): Task {
    const task: Task = {
      id: uuid(),
      title,
      completed: false,
    };

    this.#tasks.set(task.id, task);

    return task;
  }

  get(id: UUID): Task | undefined {
    return this.#tasks.get(id);
  }

  getAll(): Task[] {
    return Array.from(this.#tasks.values());
  }

  update(id: UUID, changes: Partial<Omit<Task, 'id'>>): Task | undefined {
    const task = this.get(id);

    if (task) {
      task.title = changes.title ?? task.title;
      task.completed = changes.completed ?? task.completed;

      this.#tasks.set(id, task);
    }

    return task;
  }

  delete(id: UUID): boolean {
    return this.#tasks.delete(id);
  }

  deleteAll(): void {
    this.#tasks.clear();
  }
}
