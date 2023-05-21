import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { faker } from '@faker-js/faker';
import {
  ConflictException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

const createUser = () => ({
  id: faker.number.int(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  address: faker.location.streetAddress({ useFullAddress: true }),
  email: faker.internet.email(),
  birthdate: `${faker.date.birthdate()}`,
});
describe('UserService', () => {
  let userService: UserService;
  // let userRepositoryMock: Repository<User>;
  const userRepositoryMock = {
    findOneBy: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: userRepositoryMock },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('create()', () => {
    it('should create a user', async () => {
      const user1 = createUser();

      userRepositoryMock.findOneBy.mockImplementationOnce(() =>
        Promise.resolve(),
      );

      userRepositoryMock.save.mockImplementationOnce(() =>
        Promise.resolve(user1),
      );

      expect(await userService.create(user1)).toBe(user1.id);

      expect(userRepositoryMock.findOneBy).toHaveBeenCalledTimes(1);
      expect(userRepositoryMock.findOneBy).toHaveBeenCalledWith({
        email: user1.email,
      });

      expect(userRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(userRepositoryMock.save).toHaveBeenCalledWith(user1);
    });

    it('should not create a user with taken email', async () => {
      const user1 = createUser();

      userRepositoryMock.findOneBy.mockImplementationOnce(() =>
        Promise.resolve(user1.email),
      );

      userRepositoryMock.save.mockImplementationOnce(() =>
        Promise.resolve(user1),
      );

      await expect(userService.create(user1)).rejects.toThrow(
        new ConflictException('user with provided email exists'),
      );

      expect(userRepositoryMock.findOneBy).toHaveBeenCalledTimes(1);
      expect(userRepositoryMock.findOneBy).toHaveBeenCalledWith({
        email: user1.email,
      });

      expect(userRepositoryMock.save).not.toHaveBeenCalled();
    });
  });

  describe('find()', () => {
    it('should find one users', async () => {
      const user1 = createUser();

      userRepositoryMock.findOneBy.mockImplementationOnce(() =>
        Promise.resolve(user1),
      );

      expect(await userService.findOne(user1.id)).toEqual(user1);

      expect(userRepositoryMock.findOneBy).toHaveBeenCalledTimes(1);
      expect(userRepositoryMock.findOneBy).toHaveBeenCalledWith({
        id: user1.id,
      });
    });

    it('should throw when user not found', async () => {
      const user1 = createUser();

      userRepositoryMock.findOneBy.mockImplementationOnce(() =>
        Promise.resolve(),
      );

      await expect(userService.findOne(user1.id)).rejects.toThrow(
        new NotFoundException(`user ${user1.id} not found`),
      );

      expect(userRepositoryMock.findOneBy).toHaveBeenCalledTimes(1);
      expect(userRepositoryMock.findOneBy).toHaveBeenCalledWith({
        id: user1.id,
      });
    });
  });

  describe('findAll()', () => {
    it('should find all users', async () => {
      const user1 = createUser();
      const user2 = createUser();
      const user3 = createUser();

      userRepositoryMock.find.mockImplementationOnce(() =>
        Promise.resolve([user1, user2, user3]),
      );

      expect(await userService.findAll()).toStrictEqual([user1, user2, user3]);

      expect(userRepositoryMock.find).toHaveBeenCalledTimes(1);
      expect(userRepositoryMock.find).toHaveBeenCalledWith();
    });

    it('should throw when no users found', async () => {
      userRepositoryMock.find.mockImplementationOnce(() => Promise.resolve([]));

      await expect(userService.findAll()).rejects.toThrow(
        new NotFoundException('no users found'),
      );

      expect(userRepositoryMock.find).toHaveBeenCalledTimes(1);
      expect(userRepositoryMock.find).toHaveBeenCalledWith();
    });
  });

  describe('update()', () => {
    it('should update a user', async () => {
      const user1 = createUser();
      const user2 = createUser();

      userRepositoryMock.findOneBy.mockImplementationOnce(() =>
        Promise.resolve([user1]),
      );

      expect(await userService.update(user1.id, user2)).toBe(user1.id);

      expect(userRepositoryMock.update).toHaveBeenCalledTimes(1);
      expect(userRepositoryMock.update).toHaveBeenCalledWith(user1.id, user2);
    });

    it('should throw when no users found', async () => {
      const user1 = createUser();
      const user2 = createUser();

      userRepositoryMock.findOneBy.mockImplementationOnce(() =>
        Promise.resolve(),
      );

      await expect(userService.update(user1.id, user2)).rejects.toThrow(
        new NotFoundException(`user ${user1.id} not found`),
      );

      expect(userRepositoryMock.update).not.toHaveBeenCalled();
      expect(userRepositoryMock.findOneBy).toHaveBeenCalledTimes(1);
    });

    it('should throw when update cannot complete', async () => {
      const user1 = createUser();
      const user2 = createUser();

      userRepositoryMock.findOneBy.mockImplementationOnce(() =>
        Promise.resolve(user1),
      );
      userRepositoryMock.update.mockImplementationOnce(() =>
        Promise.reject(Error('something strange happened')),
      );

      await expect(userService.update(user1.id, user2)).rejects.toThrow(
        new UnprocessableEntityException(`cannot update user ${user1.id}`),
      );

      expect(userRepositoryMock.findOneBy).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove()', () => {
    it('should throw when user not found', async () => {
      userRepositoryMock.findOneBy.mockImplementationOnce(() =>
        Promise.resolve(),
      );

      await expect(userService.remove(123)).rejects.toThrow(
        new NotFoundException(`user ${123} not found`),
      );

      expect(userRepositoryMock.delete).not.toHaveBeenCalled();
      expect(userRepositoryMock.findOneBy).toHaveBeenCalledTimes(1);
      expect(userRepositoryMock.findOneBy).toHaveBeenCalledWith({ id: 123 });
    });

    it('should throw when user deletion failed', async () => {
      const user1 = createUser();

      userRepositoryMock.findOneBy.mockImplementationOnce(() =>
        Promise.resolve(user1),
      );
      userRepositoryMock.delete.mockImplementationOnce(() =>
        Promise.resolve({}),
      );

      await expect(userService.remove(user1.id)).rejects.toThrow(
        new UnprocessableEntityException(`failed to delete user ${user1.id}`),
      );

      expect(userRepositoryMock.delete).toHaveBeenCalledTimes(1);
      expect(userRepositoryMock.delete).toHaveBeenCalledWith({ id: user1.id });
    });

    it('should remove a user', async () => {
      const user1 = createUser();

      userRepositoryMock.findOneBy.mockImplementationOnce(() =>
        Promise.resolve(user1),
      );
      userRepositoryMock.delete.mockImplementationOnce(() =>
        Promise.resolve({ affected: 1 }),
      );

      expect(await userService.remove(user1.id)).toBe(user1.id);

      expect(userRepositoryMock.delete).toHaveBeenCalledTimes(1);
      expect(userRepositoryMock.delete).toHaveBeenCalledWith({ id: user1.id });
    });
  });
});
