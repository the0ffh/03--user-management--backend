import { AppModule } from './app/app.module';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    abortOnError: false,
    cors: true,
  });

  const config = new DocumentBuilder()
    .setTitle('User Management API')
    .setDescription('API docs')
    .setVersion('1.0')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, config);

  app.use('/openapi', (req, res) => res.send(swaggerDocument));

  SwaggerModule.setup('api', app, swaggerDocument);

  await app.listen(3000);
}

bootstrap()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('running @ http://localhost:3000');
    // eslint-disable-next-line no-console
    console.log('api docs @ http://localhost:3000/api');
    // eslint-disable-next-line no-console
    console.log('openapi @ http://localhost:3000/openapi');
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
  });
