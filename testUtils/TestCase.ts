import { DatabaseConnection } from './Database';
import { faker } from '@faker-js/faker';

const connectionOptions = {
  host: '127.0.0.1',
  password: 'root',
  port: 3306,
  user: 'root',
};

export class TestCase {
  constructor() {
    this.databaseConnection = new DatabaseConnection(connectionOptions);
    this.databaseName = `test_${faker.string.alphanumeric(10)}`;
  }

  public setup = async () =>
    this.databaseConnection.createDatabase(this.databaseName).then(() => {
      console.log(`database ${this.databaseName} created`);
    });

  public destroy = async () =>
    this.databaseConnection.dropDatabase(this.databaseName).then(() => {
      console.log(`database ${this.databaseName} dropped`);
    });

  public getDatabaseName = () => this.databaseName;

  private databaseConnection: DatabaseConnection;
  private readonly databaseName: string;
}
