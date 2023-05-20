import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { dataSourceOptions } from '../data-source';
import { DataSource } from 'typeorm';

/*
 * ConfigModule + TypeOrmModule cfg
 * ref: https://jaketrent.com/post/configure-typeorm-inject-nestjs-config/
 */
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({ ...dataSourceOptions, autoLoadEntities: true }),
    }),
    UserModule,
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
