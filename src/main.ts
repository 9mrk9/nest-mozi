import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { checkOrCreateFolder } from './lib/scripts';
import { bookingsPath } from './lib/constants';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));

  app.setViewEngine('ejs');

  await checkOrCreateFolder(bookingsPath.replace('bookings.csv', ''));

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
