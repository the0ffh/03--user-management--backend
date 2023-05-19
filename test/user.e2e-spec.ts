import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserModule } from '../src/user/user.module';
import { AppModule } from '../src/app/app.module';
import { CreateUserDto } from '../src/user/dto/create-user.dto';
import { UpdateUserDto } from '../src/user/dto/update-user.dto';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, UserModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
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

    it('should create a user', () => {
      const payload: CreateUserDto = {
        address: 'Messedamm 59, Dresden',
        birthdate: '01.02.1980',
        email: 'john@doe.com',
        firstName: 'john',
        lastName: 'doe',
      };

      return request(app.getHttpServer())
        .post('/user')
        .send(payload)
        .expect(201);
    });

    it('should not create a user with extra payload properties', () => {
      const payload: CreateUserDto = {
        address: 'la street 1234',
        birthdate: '01.01.1900',
        email: 'adam@test.com',
        firstName: 'adam',
        lastName: 'sandler',
      };

      return request(app.getHttpServer())
        .post('/user')
        .send({ ...payload, shoeSize: 43 })
        .expect(400)
        .expect((response) =>
          expect(response.body).toEqual(
            expect.objectContaining({
              message: ['property shoeSize should not exist'],
            }),
          ),
        );
    });

    it('should not create a user with taken email', () => {
      const payload: CreateUserDto = {
        address: 'Messedamm 59, Dresden',
        birthdate: '01.02.1980',
        email: 'john@doe.com',
        firstName: 'john',
        lastName: 'doe',
      };

      return request(app.getHttpServer())
        .post('/user')
        .send(payload)
        .expect((response) =>
          expect(response.body).toEqual(
            expect.objectContaining({
              message: 'user with provided email exists',
              statusCode: 409,
            }),
          ),
        );
    });
  });

  describe('/ (GET)', () => {
    it('should return all users', () => {
      return request(app.getHttpServer())
        .get('/user')
        .expect(200)
        .expect([
          {
            id: 1,
            firstName: 'john',
            lastName: 'doe',
            address: 'Messedamm 59, Dresden',
            email: 'john@doe.com',
            birthdate: '01.02.1980',
          },
          {
            id: 2,
            firstName: 'Bernard',
            lastName: 'Jung',
            address: 'Philipp-Reis-Strasse 4, Hesse',
            email: 'bernard@jung.com',
            birthdate: '01.03.1982',
          },
        ]);
    });

    it('should return single user', () => {
      const expected = {
        id: 2,
        firstName: 'Bernard',
        lastName: 'Jung',
        address: 'Philipp-Reis-Strasse 4, Hesse',
        email: 'bernard@jung.com',
        birthdate: '01.03.1982',
      };

      return request(app.getHttpServer())
        .get(`/user/${expected.id}`)
        .expect(200)
        .expect(expected);
    });

    it('should return http 404 when user not found', () => {
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

  describe('/ (PATCH)', () => {
    it('should update a user', () => {
      const payload: UpdateUserDto = {
        address: 'la street 1234',
        birthdate: '01.01.1900',
        email: 'adam@test.com',
        firstName: 'adam',
        lastName: 'sandler',
      };

      return request(app.getHttpServer())
        .patch('/user/1')
        .send(payload)
        .expect(200)
        .expect('successfully updated user 1');
    });

    it('should not update a user with extra payload properties', async () => {
      const payload: UpdateUserDto = {
        address: 'la street 1234',
        birthdate: '01.01.1900',
        email: 'adam@test.com',
        firstName: 'adam',
        lastName: 'sandler',
      };

      return request(app.getHttpServer())
        .patch('/user/1')
        .send({ ...payload, shoeSize: 43 })
        .expect(400)
        .expect((response) =>
          expect(response.body).toEqual(
            expect.objectContaining({
              message: ['property shoeSize should not exist'],
            }),
          ),
        );
    });

    it('should not update a user with malformed email', async () => {
      const payload: UpdateUserDto = {
        address: 'wall street 2000',
        birthdate: '01.01.2000',
        email: 'adam@te@st.com',
        firstName: 'adam',
        lastName: 'sandler',
      };

      return request(app.getHttpServer())
        .patch('/user/1')
        .send(payload)
        .expect(400)
        .expect((response) =>
          expect(response.body).toEqual(
            expect.objectContaining({ message: ['email must be an email'] }),
          ),
        );
    });
  });

  describe('/ (DELETE)', () => {
    it('should return http 404 when user not found', () => {
      return request(app.getHttpServer())
        .delete('/user/54321')
        .expect((response) =>
          expect(response.body).toEqual(
            expect.objectContaining({
              message: 'user 54321 not found',
              statusCode: 404,
            }),
          ),
        );
    });

    it('should delete a user', async () => {
      return request(app.getHttpServer())
        .delete('/user/4')
        .expect(200)
        .expect('successfully deleted user 4');
    });
  });
});
