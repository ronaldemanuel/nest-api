import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepositoy: Repository<User>,
  ) {
    return;
  }

  async createUser(data: CreateUserInput): Promise<User> {
    const user = await this.userRepositoy.create(data);
    const userSaved = await this.userRepositoy.save(user);

    if (!userSaved) {
      throw new InternalServerErrorException('Erro ao criar usuário.');
    }

    return userSaved;
  }
}
