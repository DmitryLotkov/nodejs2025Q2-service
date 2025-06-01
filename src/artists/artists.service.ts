import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { Artist, ArtistDto } from './artist.entity';
import { randomUUID } from 'crypto';
import { AlbumService } from '../albums/album.service';
import { TracksService } from '../tracks/tracks.service';

@Injectable()
export class ArtistsService {
  constructor(
    private readonly trackService: TracksService,
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
  ) {}
  private artists: Artist[] = [];

  public findAll(): Artist[] {
    return this.artists;
  }

  public findById(id: string): Artist {
    const artist = this.artists.find((artist) => artist.id === id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    return artist;
  }

  public create(dto: ArtistDto): Artist {
    const artist: Artist = {
      id: randomUUID(),
      grammy: dto.grammy,
      name: dto.name,
    };

    this.artists.push(artist);
    return artist;
  }

  public update(id: string, dto: ArtistDto): Artist {
    const index = this.artists.findIndex((artist) => artist.id === id);
    if (index === -1) {
      throw new NotFoundException('Artist not found');
    }

    const updatedArtist = {
      ...this.artists[index],
      name: dto.name,
      grammy: dto.grammy,
    };

    this.artists[index] = updatedArtist;
    return updatedArtist;
  }

  public delete(id: string): void {
    const index = this.artists.findIndex((artist) => artist.id === id);
    if (index === -1) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }

    this.artists.splice(index, 1);

    this.albumService.removeByArtistId(id);
    this.trackService.removeByArtistId(id);
    //this.favoritesService.removeArtist(id); // TODO: реализовать
  }
}
