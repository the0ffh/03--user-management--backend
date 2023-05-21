import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

const createUser = () => ({
  id: faker.number.int(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  address: faker.location.streetAddress({ useFullAddress: true }),
  email: faker.internet.email(),
  birthdate: `${faker.date.birthdate()}`,
});

const userServiceMock = {
  create: jest.fn(),
  update: jest.fn(),
  findOne: jest.fn(),
  findAll: jest.fn(),
  remove: jest.fn(),
};

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneBy: () => 1,
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    const user = createUser();

    userServiceMock.create.mockImplementationOnce(() => Promise.resolve(1));

    expect(await controller.create(user)).toEqual(1);
    expect(userServiceMock.create).toHaveBeenCalledTimes(1);
    expect(userServiceMock.create).toHaveBeenCalledWith(user);
  });

  it('should find all users', async () => {
    const user1 = createUser();
    const user2 = createUser();
    const user3 = createUser();

    userServiceMock.findAll.mockImplementationOnce(() =>
      Promise.resolve([user1, user2, user3]),
    );

    expect(await controller.findAll()).toBe([user1, user2, user3]);
    expect(userServiceMock.findAll).toHaveBeenCalledTimes(1);
    expect(userServiceMock.findAll).toHaveBeenCalledWith();
  });

  it('should find one user', async () => {
    const user1 = createUser();

    userServiceMock.findOne.mockImplementationOnce(() =>
      Promise.resolve(user1),
    );

    expect(await controller.findOne(1)).toBe(user1);
    expect(userServiceMock.findOne).toHaveBeenCalledTimes(1);
    expect(userServiceMock.findOne).toHaveBeenCalledWith(1);
  });

  it('should update a user', async () => {
    const user1 = createUser();

    userServiceMock.update.mockImplementationOnce(() => Promise.resolve(1));

    expect(await controller.update(user1.id, user1)).toBe(1);
    expect(userServiceMock.update).toHaveBeenCalledTimes(1);
    expect(userServiceMock.update).toHaveBeenCalledWith(user1.id, user1);
  });

  it('should delete a user', async () => {
    userServiceMock.remove.mockImplementationOnce(() => Promise.resolve(1));

    expect(await controller.remove(1)).toBe(1);
    expect(userServiceMock.remove).toHaveBeenCalledTimes(1);
    expect(userServiceMock.remove).toHaveBeenCalledWith(1);
  });
});
