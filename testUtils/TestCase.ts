import { DatabaseConnection } from './Database';

const connectionOptions = {
  host: '127.0.0.1',
  password: 'root',
  port: 3306,
  user: 'root',
};

export class TestCase {
  constructor(private databaseName: string) {
    if (/\s/.test(databaseName))
      throw Error(`databaseName '${databaseName} contains white space`);

    this.databaseConnection = new DatabaseConnection(connectionOptions);
  }

  public setup = async () =>
    this.databaseConnection.createDatabase(this.databaseName).then(() => {
      console.log(`database ${this.databaseName} created`);
    });

  public destroy = async () =>
    this.databaseConnection.dropDatabase(this.databaseName).then(() => {
      console.log(`database ${this.databaseName} dropped`);
    });

  private databaseConnection: DatabaseConnection;
}
