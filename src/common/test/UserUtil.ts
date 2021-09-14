import { User } from '../../user/user.entity';

export default class UserUtil {
  static giveMeAValidUser(): User {
    const user = new User();
    user.id = '1';
    user.name = 'Test name';
    user.email = 'test@email.com';
    user.password = '123456';

    return user;
  }
}
