import { MinLength, PrimaryKey, UUID, entity } from '@deepkit/type';


@entity.name('task')
export class Task {
  id!: UUID & PrimaryKey;
  title!: string & MinLength<3>;
  completed!: boolean;

  constructor(title: string) {
    this.title = title;
    this.completed = false;
  }
}
