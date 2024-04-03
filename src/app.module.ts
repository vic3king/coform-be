import { Module, Logger, OnApplicationShutdown } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { UserService } from './user.service';
import { UploadService } from './upload.service';
import { DocumentService } from './document.service';

const logger = new Logger('AppModule');

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    UserService,
    UploadService,
    DocumentService,
  ],
})
export class AppModule implements OnApplicationShutdown {
  onApplicationShutdown(signal: string) {
    logger.log(`Gracefully shutting down on ${signal} signal`);
  }
}
