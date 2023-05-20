import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { UserModule } from '../src/user/user.module';
import { AppModule } from '../src/app/app.module';
import { setupTestCase } from '../testUtils/TestCase';

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

  describe.only('set up tes case', () => {
    it('should set up db', () => {
      setupTestCase({ dbName: 'meeeeep' });
    });
  });
});
