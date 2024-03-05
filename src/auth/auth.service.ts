import { Database } from '@deepkit/orm';
import { PasswordHashingAlgorithm } from 'oslo/password';

import { Register } from './register.dto';
import { User } from './user.entity';

export class AuthService {
  constructor(
    private readonly database: Database,
    private readonly passwordHasher: PasswordHashingAlgorithm,
  ) {}

  async register(newUser: Register): Promise<User> {
    const user = new User();

    user.email = newUser.email;
    user.password = await this.passwordHasher.hash(newUser.password);
    await this.database.persist(user);

    return user;
  }
}
