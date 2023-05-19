import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'path';
import { UserModule } from '../user/user.module';

/*
 * ConfigModule + TypeOrmModule cfg
 * ref: https://jaketrent.com/post/configure-typeorm-inject-nestjs-config/
 */

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('MYSQL_DATABASE_HOST'),
        port: configService.get('MYSQL_PORT'),
        database: configService.get('MYSQL_DATABASE'),
        username: configService.get('MYSQL_USER'),
        password: configService.get('MYSQL_PASSWORD'),
        entities: [path.join(__dirname, '../src/**/*.entity.ts')],
        synchronize: false,
        migrations: [path.join(__dirname, '../migration/**/*.ts')],
        // ...dataSourceOptions,
        autoLoadEntities: true,
      }),
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
