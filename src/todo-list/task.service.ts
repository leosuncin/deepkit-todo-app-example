import { Partial, UUID } from '@deepkit/type';
import { Database } from '@deepkit/orm';

import { Task } from './task.entity';

export class TaskService {
  constructor(private readonly db: Database) {}

  async create(title: Task['title']): Promise<Task> {
    const task = new Task(title);

    await this.db.persist(task);

    return task;
  }

  get(id: UUID): Promise<Task | undefined> {
    return this.db.query(Task).filter({ id }).findOneOrUndefined();
  }

  getAll(): Promise<Task[]> {
    return this.db.query(Task).find();
  }

  async update(
    id: UUID,
    changes: Partial<Omit<Task, 'id'>>,
  ): Promise<Task | undefined> {
    const task = await this.get(id);

    if (task) {
      task.title = changes.title ?? task.title;
      task.completed = changes.completed ?? task.completed;

      await this.db.persist(task);
    }

    return task;
  }

  async delete(id: UUID): Promise<Task | undefined> {
    const task = await this.get(id);

    if (!task) return;

    await this.db.remove(task);

    return task;
  }

  async deleteAll(): Promise<void> {
    await this.db.query(Task).deleteMany();
  }
}
