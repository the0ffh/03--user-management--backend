import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import * as path from 'path';

export class DatabaseConfiguration implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    return {
      type: 'mysql',

      host: process.env.MYSQL_DATABASE_HOST,
      port: parseInt(process.env.MYSQL_DATABASE_PORT, 10),
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,

      entities: [path.join(__dirname, '../src/**/*.entity.{js,ts}')],
      synchronize: false,
      migrations: [path.join(__dirname, '../migration/**/*.{js,ts}')],
    };
  }
}
