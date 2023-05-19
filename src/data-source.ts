import { DataSource, DataSourceOptions } from 'typeorm';
import * as path from 'path';

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  database: 'devdb',
  username: 'dev',
  password: 'devpw',
  entities: [path.join(__dirname, '../src/**/*.entity.ts')],
  synchronize: false,
  migrations: [path.join(__dirname, '../migration/**/*.ts')],
};

export const dataSource = new DataSource(dataSourceOptions);
