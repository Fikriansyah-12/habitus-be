import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // ✅ CORS dulu (biar preflight aman)
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      // kalau FE sudah deploy, tambahin domainnya di sini
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // ✅ Prefix tanpa leading slash
  app.setGlobalPrefix('api/v1');

  // ✅ Security headers
  app.use(helmet());

  // ✅ Validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
    }),
  );

  // ✅ Static assets
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // ✅ Swagger
  const config = new DocumentBuilder()
    .setTitle('Habitus API - Dashboard Request Jadwal Operasional')
    .setDescription('API untuk mengelola request jadwal operasional tim Habitus')
    .setVersion('1.0.0')
    .addServer('http://localhost:3000', 'Local Server')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'jwt',
    )
    .addTag('Auth', 'Authentication endpoints')
    .addTag('Customers', 'Customer management')
    .addTag('Quotes', 'Quote management')
    .addTag('Onsite Requests', 'Onsite request management')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
}

bootstrap();
