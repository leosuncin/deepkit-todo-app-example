import { Email, MaxLength, MinLength, entity } from '@deepkit/type';

@entity.name('register')
export class Register {
  readonly email!: string & Email;
  readonly password!: string & MinLength<8> & MaxLength<32>;
}
