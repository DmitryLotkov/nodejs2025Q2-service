import { Module, forwardRef } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumsController } from './albums.controller';
import { ArtistsModule } from '../artists/artists.module';
import { TracksModule } from '../tracks/tracks.module';

@Module({
  imports: [forwardRef(() => ArtistsModule), forwardRef(() => TracksModule)],
  providers: [AlbumService],
  controllers: [AlbumsController],
  exports: [AlbumService],
})
export class AlbumsModule {}
