import { Database, MemoryDatabaseAdapter } from '@deepkit/orm';
import { cast } from '@deepkit/type';
import { describe, jest } from '@jest/globals';

import { AuthService } from './auth.service';
import { Register } from './register.dto';
import { User } from './user.entity';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService(
      new Database(new MemoryDatabaseAdapter(), [User]),
      {
        hash: jest.fn(async (password: string) =>
          password.split('').reverse().join(''),
        ),
        verify: jest.fn(async (): Promise<boolean> => true),
      },
    );
  });

  it('be defined', () => {
    expect(authService).toBeDefined();
  });

  it('register a user with a valid email and password', async () => {
    const newUser = cast<Register>({
      email: 'admin@example.com',
      password: 'password',
    });
    const user = await authService.register(newUser);

    expect(user).toBeDefined();
    expect(user).toMatchObject({
      id: expect.any(String),
      email: newUser.email,
      password: expect.any(String),
    });
    expect(user.password).not.toBe(newUser.password);
  });
});
