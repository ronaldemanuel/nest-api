import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
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

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userRepositoy.findOne({ where: { email } });

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

  async updateUser(id: string, data: UpdateUserInput): Promise<User> {
    const user = await this.findUserById(id);
    await this.userRepositoy.update(user, { ...data });

    const updatedUser = this.userRepositoy.create({ ...user, ...data }); // Like a merge
    return updatedUser;
  }

  async deleteUser(id: string): Promise<boolean> {
    const user = await this.findUserById(id);
    const deleted = await this.userRepositoy.delete(user);

    if (deleted) {
      return true;
    }

    return false;
  }
}
