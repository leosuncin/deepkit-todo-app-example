import { createModule } from '@deepkit/app';
import { provide } from '@deepkit/injector';
import { Argon2id, PasswordHashingAlgorithm } from 'oslo/password';

export class AuthModule extends createModule({
  providers: [provide<PasswordHashingAlgorithm>(Argon2id)],
  controllers: [],
}) {}
