import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { CreateUserDto } from './dto/create-user.dto';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: {} },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const user: CreateUserDto = {
        address: faker.location.streetAddress(),
        birthdate: `${faker.date.birthdate()}`,
        email: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
      };

      jest
        .spyOn(service, 'create')
        .mockImplementationOnce(() => Promise.resolve({ ...user, id: 1 }));

      expect(await controller.create(user)).toStrictEqual({ id: 1, ...user });
    });
  });

  describe('find', () => {
    it('should find all users', async () => {
      const userOne: User = {
        id: 1,
        address: faker.location.streetAddress(),
        birthdate: `${faker.date.birthdate()}`,
        email: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
      };

      const userTwo: User = {
        id: 2,
        address: faker.location.streetAddress(),
        birthdate: `${faker.date.birthdate()}`,
        email: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
      };

      const users = [userOne, userTwo];

      jest
        .spyOn(service, 'findAll')
        .mockImplementationOnce(() => Promise.resolve(users));

      expect(await controller.findAll()).toBe(users);
    });

    it('should find one user', async () => {
      const userOne: User = {
        id: 1,
        address: faker.location.streetAddress(),
        birthdate: `${faker.date.birthdate()}`,
        email: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
      };

      jest
        .spyOn(service, 'findOne')
        .mockImplementationOnce(() => Promise.resolve(userOne));

      expect(await controller.findOne(1)).toBe(userOne);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      jest
        .spyOn(service, 'update')
        .mockImplementationOnce((id: number) =>
          Promise.resolve(`user ${id} updated`),
        );

      expect(
        await controller.update(999, {
          address: faker.location.streetAddress(),
          birthdate: `${faker.date.birthdate()}`,
          email: faker.internet.email(),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
        }),
      ).toBe('user 999 updated');
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      jest
        .spyOn(service, 'remove')
        .mockImplementationOnce((id: number) =>
          Promise.resolve(`user ${id} deleted`),
        );

      expect(await controller.remove(999)).toBe('user 999 deleted');
    });
  });
});
