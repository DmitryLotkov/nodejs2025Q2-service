import { Module } from '@nestjs/common';
import { AlbumsModule } from './albums/albums.module';
import { ArtistsModule } from './artists/artists.module';
import { UsersModule } from './users/users.module';
import { TracksModule } from './tracks/tracks.module';
import { FavoritesModule } from './favorites/favorites.module';
import { PrismaModule } from './prisma/prisma/prisma.module';
import { GlobalExceptionFilter } from './common/filter/http-exeption.filter';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingService } from './logger/logger.service';
import { LoggingInterceptor } from './logger/logging.interceptor';

@Module({
  imports: [
    AlbumsModule,
    ArtistsModule,
    UsersModule,
    TracksModule,
    FavoritesModule,
    PrismaModule,
  ],
  controllers: [],
  providers: [
    LoggingService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
