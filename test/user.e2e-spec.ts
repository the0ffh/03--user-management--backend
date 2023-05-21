import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, NotFoundException } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app/app.module';
import { UserService } from '../src/user/user.service';

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
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(UserService)
      .useValue(userServiceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/ (GET)', () => {
    it('should return all users', () => {
      const user1 = createUser();
      const user2 = createUser();
      const user3 = createUser();

      userServiceMock.findAll.mockImplementationOnce(() =>
        Promise.resolve([user1, user2, user3]),
      );

      return request(app.getHttpServer())
        .get('/user')
        .expect(200)
        .expect([user1, user2, user3]);
    });

    it('should return single user', () => {
      const user1 = createUser();

      userServiceMock.findOne.mockImplementationOnce(() =>
        Promise.resolve(user1),
      );

      return request(app.getHttpServer())
        .get(`/user/${user1.id}`)
        .expect(200)
        .expect(user1);
    });

    it('should return http 404 when user not found', () => {
      userServiceMock.findOne.mockImplementationOnce(() =>
        Promise.reject(new NotFoundException('user 12345 not found')),
      );

      return request(app.getHttpServer())
        .get(`/user/12345`)
        .expect((response) =>
          expect(response.body).toEqual(
            expect.objectContaining({
              message: 'user 12345 not found',
              statusCode: 404,
            }),
          ),
        );
    });
  });

  describe('/ (POST)', () => {
    it('should not create a user with no payload', () => {
      return request(app.getHttpServer())
        .post('/user')
        .expect(400)
        .expect({
          statusCode: 400,
          message: [
            'firstName must be longer than or equal to 1 characters',
            'firstName must be a string',
            'lastName must be longer than or equal to 1 characters',
            'lastName must be a string',
            'address must be longer than or equal to 1 characters',
            'address must be a string',
            'email must be an email',
            'email must be a string',
            'birthdate must be longer than or equal to 1 characters',
            'birthdate must be a string',
          ],
          error: 'Bad Request',
        });
    });

    it('should not create a user with extra payload properties', () => {
      const user1 = createUser();

      return request(app.getHttpServer())
        .post('/user')
        .send(user1)
        .expect(400)
        .expect((response) =>
          expect(response.body).toEqual(
            expect.objectContaining({
              message: ['property id should not exist'],
            }),
          ),
        );
    });

    it('should create a user', () => {
      const user1 = createUser();
      delete user1['id'];

      userServiceMock.create.mockImplementationOnce(() => Promise.resolve(1));

      return request(app.getHttpServer()).post('/user').send(user1).expect(201);
    });
  });

  describe('/ (PATCH)', () => {
    it('should update a user', () => {
      const user1 = createUser();
      userServiceMock.findOne.mockImplementationOnce(() =>
        Promise.resolve(user1),
      );

      delete user1['id'];
      userServiceMock.update.mockImplementationOnce(() => Promise.resolve());

      return request(app.getHttpServer())
        .patch(`/user/${user1.id}`)
        .send(user1)
        .expect(200);
    });

    it('should not update a user with extra payload properties', async () => {
      const user1 = createUser();

      return request(app.getHttpServer())
        .patch('/user/1')
        .send(user1)
        .expect((response) =>
          expect(response.body).toEqual(
            expect.objectContaining({
              message: ['property id should not exist'],
              statusCode: 400,
            }),
          ),
        );
    });
    it('should not update a user with malformed email', async () => {
      const user1 = createUser();
      user1.email = 'adam@adam@test.om';
      delete user1['id'];

      return request(app.getHttpServer())
        .patch('/user/1')
        .send(user1)
        .expect(400)
        .expect((response) =>
          expect(response.body).toEqual(
            expect.objectContaining({ message: ['email must be an email'] }),
          ),
        );
    });
  });

  describe('/ (DELETE)', () => {
    it('should delete a user', async () => {
      const user1 = createUser();
      userServiceMock.findOne.mockImplementationOnce(() =>
        Promise.resolve(user1),
      );

      return request(app.getHttpServer())
        .delete(`/user/${user1.id}`)
        .expect(200);
    });
  });
});
