import { MinLength, PrimaryKey, UUID, entity, uuid } from '@deepkit/type';

@entity.name('task').collection('tasks')
export class Task {
  id!: UUID & PrimaryKey;
  title!: string & MinLength<3>;
  completed!: boolean;

  constructor(title?: string & MinLength<3>) {
    this.id = uuid();
    this.completed = false;
    if (title) this.title = title;
  }
}
