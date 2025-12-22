import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const isDevelopment = process.env.NODE_ENV !== 'production';

  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:8080',
    // contoh kalau FE deploy:
    // 'https://your-frontend.netlify.app',
    // 'https://your-frontend.vercel.app',
  ];

  app.enableCors({
    origin: isDevelopment ? true : (origin, callback) => {
      // allow server-to-server / curl (origin undefined)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) return callback(null, true);

      return callback(new Error(`CORS blocked for origin: ${origin}`), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 204,
  });


  app.use(
    helmet({
      crossOriginResourcePolicy: false,
    }),
  );

  app.setGlobalPrefix('api/v1');

  app.useStaticAssets(join(__dirname, '..', 'public'));

  const config = new DocumentBuilder()
    .setTitle('Habitus API - Dashboard Request Jadwal Operasional')
    .setDescription('API untuk mengelola request jadwal operasional tim Habitus')
    .setVersion('1.0.0')
    // server buat docs (optional)
    .addServer('http://localhost:3000', 'Local Server')
    // kalau mau tambahin server prod:
    // .addServer('https://habitus-be-production.up.railway.app', 'Production Server')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'jwt',
    )
    .addTag('Auth', 'Authentication endpoints')
    .addTag('Customers', 'Customer management')
    .addTag('Quotes', 'Quote management')
    .addTag('Onsite Requests', 'Onsite request management')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Server running on port ${port}`);
  console.log(`📚 Swagger docs: /api/docs`);
}

bootstrap();
