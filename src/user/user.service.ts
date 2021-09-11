import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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

  async findAllUsers(): Promise<User[]> {
    const users = await this.userRepositoy.find();
    return users;
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.userRepositoy.findOne(id);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async createUser(data: CreateUserInput): Promise<User> {
    const user = this.userRepositoy.create(data);
    const userSaved = await this.userRepositoy.save(user);

    if (!userSaved) {
      throw new InternalServerErrorException('Erro ao criar usuário.');
    }

    return userSaved;
  }
}
