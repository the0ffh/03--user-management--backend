import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import * as path from 'path';
// import {SnakeNamingStrategy} from "typeorm-naming-strategies";

export class DatabaseConfiguration implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    return {
      type: 'mysql',
      host: process.env.MYSQL_DATABASE_HOST,
      port: parseInt(process.env.MYSQL_DATABASE_PORT, 10) || 5432,
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,

      entities: [path.join(__dirname, '../src/**/*.entity.ts')],
      synchronize: false,
      migrations: [path.join(__dirname, '../migration/**/*.ts')],
      // cli: {
      //   migrationsDir: process.env.TYPEORM_MIGRATIONS_DIR,
      // },
      // namingStrategy: new SnakeNamingStrategy(),
    };
  }
}
