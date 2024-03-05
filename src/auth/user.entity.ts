import { Email, PrimaryKey, UUID, entity, uuid } from '@deepkit/type';

@entity.name('user').collection('users')
export class User {
  readonly id: UUID & PrimaryKey = uuid();
  email!: string & Email;
  password!: string;
  bio?: string;
}
