import { AppModule } from './app/app.module';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    abortOnError: false,
    cors: true,
    logger: ['debug', 'error', 'log', 'verbose', 'warn'],
  });

  const port = process.env.SERVER_PORT;
  const apiPath = process.env.SERVER_API_PATH;
  const openApiPath = process.env.SERVER_OPENAPI_PATH;

  const config = new DocumentBuilder()
    .setTitle('User Management API')
    .setDescription('API docs')
    .setVersion('1.0')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, config);

  app.use(`/${openApiPath}`, (req, res) => res.send(swaggerDocument));

  SwaggerModule.setup(apiPath, app, swaggerDocument);

  await app.listen(port);

  console.log(`
  running @ http://localhost:${port}
  api docs @ http://localhost:${port}/${apiPath}
  openapi @ http://localhost:${port}/${openApiPath}`);
}

bootstrap().catch((err) => {
  console.error(err);
});
