import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseConfiguration } from '../database.configuration';

/*
 * ConfigModule + TypeOrmModule cfg
 * ref: https://jaketrent.com/post/configure-typeorm-inject-nestjs-config/
 */
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfiguration,
    }),
    UserModule,
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
