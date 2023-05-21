import * as mysql from 'mysql2/promise';
import { ConnectionOptions } from 'mysql2/promise';

export class DatabaseConnection {
  constructor(private connectionOptions: ConnectionOptions) {}

  private executeQuery = async (query: string) =>
    mysql
      .createConnection(this.connectionOptions)
      .then((connection) =>
        connection.execute(query).finally(() => connection.end()),
      );

  public createDatabase = async (name: string) =>
    this.executeQuery(`CREATE DATABASE ${name}`);

  public dropDatabase = async (name: string) =>
    this.executeQuery(`DROP DATABASE ${name}`);
}
