import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import UserUtil from '../common/test/UserUtil';
import { User } from './user.entity';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  beforeEach(() => {
    mockRepository.find.mockReset();
    mockRepository.findOne.mockReset();
    mockRepository.create.mockReset();
    mockRepository.save.mockReset();
    mockRepository.update.mockReset();
    mockRepository.delete.mockReset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('When search all users', () => {
    it('should be list all users', async () => {
      const user = UserUtil.giveMeAValidUser();
      mockRepository.find.mockReturnValue([user, user]);
      const users = await service.findAllUsers();

      expect(users).toHaveLength(2);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('When search user by id', () => {
    it('should find a existing user', async () => {
      const user = UserUtil.giveMeAValidUser();
      mockRepository.findOne.mockReturnValue(user);
      const userFound = await service.findUserById('1');

      expect(userFound).toMatchObject({ name: user.name });
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should return a exception when does not find a user', async () => {
      mockRepository.findOne.mockReturnValue(null);

      expect(service.findUserById('2')).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('When create user', () => {
    it('should create a user', async () => {
      const user = UserUtil.giveMeAValidUser();
      mockRepository.save.mockReturnValue(user);
      mockRepository.create.mockReturnValue(user);
      const savedUser = await service.createUser(user);

      expect(savedUser).toMatchObject(user);
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should return a exception when doesnt create user', async () => {
      const user = UserUtil.giveMeAValidUser();
      mockRepository.save.mockReturnValue(null);
      mockRepository.create.mockReturnValue(user);

      await service.createUser(user).catch((e) => {
        expect(e).toBeInstanceOf(InternalServerErrorException);
        expect(e).toMatchObject({
          message: 'Erro ao criar usuário.',
        });
      });
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('When update user', () => {
    it('should update a user', async () => {
      const user = UserUtil.giveMeAValidUser();
      const updatedUser = { name: 'Nome Atualizado' };
      mockRepository.findOne.mockReturnValue(user);
      mockRepository.update.mockReturnValue({
        ...user,
        ...updatedUser,
      });
      mockRepository.create.mockReturnValue({
        ...user,
        ...updatedUser,
      });

      const resultUser = await service.updateUser('1', {
        ...user,
        name: 'Nome Atualizado',
      });

      expect(resultUser).toMatchObject(updatedUser);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockRepository.update).toHaveBeenCalledTimes(1);
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('When delete user', () => {
    it('should delete a existing user', async () => {
      const user = UserUtil.giveMeAValidUser();
      mockRepository.findOne.mockReturnValue(user);
      mockRepository.delete.mockReturnValue(user);
      const deletedUser = await service.deleteUser('2');

      expect(deletedUser).toBe(true);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockRepository.delete).toHaveBeenCalledTimes(1);
    });

    it('should not delete a inexisting user', async () => {
      const user = UserUtil.giveMeAValidUser();
      mockRepository.findOne.mockReturnValue(user);
      mockRepository.delete.mockReturnValue(null);
      const deletedUser = await service.deleteUser('2');

      expect(deletedUser).toBe(false);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockRepository.delete).toHaveBeenCalledTimes(1);
    });
  });
});
