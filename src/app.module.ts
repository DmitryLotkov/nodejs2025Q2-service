import { Module } from '@nestjs/common';
import { AlbumsModule } from './albums/albums.module';
import { ArtistsModule } from './artists/artists.module';
import { UsersModule } from './users/users.module';
import { TracksModule } from './tracks/tracks.module';
import { FavoritesModule } from './favorites/favorites.module';
import { PrismaModule } from './prisma/prisma/prisma.module';

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
  providers: [],
})
export class AppModule {}
