import { Module, forwardRef } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { TrackController } from './track.controller';
import { AlbumsModule } from '../albums/albums.module';
import { FavoritesModule } from '../favorites/favorites.module';

@Module({
  imports: [forwardRef(() => AlbumsModule), forwardRef(() => FavoritesModule)],
  controllers: [TrackController],
  providers: [TracksService],
  exports: [TracksService],
})
export class TracksModule {}
