import { DataSource, DataSourceOptions } from 'typeorm';
import * as path from 'path';
import * as process from 'process';

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.MYSQL_DATABASE_HOST,
  port: parseInt(process.env.MYSQL_DATABASE_PORT),
  database: process.env.MYSQL_DATABASE,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  entities: [path.join(__dirname, 'src/**/*.entity.ts')],
  synchronize: false,
  migrations: [path.join(__dirname, 'migration/**/*.ts')],
};

export const dataSource = new DataSource(dataSourceOptions);
