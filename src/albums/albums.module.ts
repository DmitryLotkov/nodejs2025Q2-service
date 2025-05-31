import { Module, forwardRef } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumsController } from './albums.controller';
import { ArtistsModule } from '../artists/artists.module';

@Module({
  imports: [forwardRef(() => ArtistsModule)],
  providers: [AlbumService],
  controllers: [AlbumsController],
  exports: [AlbumService],
})
export class AlbumsModule {}
