import { Module } from '@nestjs/common';
import { AlbumsModule } from './albums/albums.module';
import { ArtistsModule } from './artists/artists.module';
import { UsersModule } from './users/users.module';
import { TracksModule } from './tracks/tracks.module';

@Module({
  imports: [AlbumsModule, ArtistsModule, UsersModule, TracksModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
