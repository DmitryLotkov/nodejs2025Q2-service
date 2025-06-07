import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { Artist, ArtistDto } from './artist.entity';
import { randomUUID } from 'crypto';
import { AlbumsService } from '../albums/albums.service';
import { TracksService } from '../tracks/tracks.service';
import { FavoritesService } from '../favorites/favorites.service';

@Injectable()
export class ArtistsService {
  constructor(
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
    private readonly trackService: TracksService,
    @Inject(forwardRef(() => AlbumsService))
    private readonly albumService: AlbumsService,
  ) {}
  private artists: Artist[] = [];

  public findAll(): Artist[] {
    return this.artists;
  }

  public getById(id: string): Artist {
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
    const everExisted = this.artists.some((artist) => artist.id === id);

    if (!everExisted) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }

    this.artists = this.artists.filter((artist) => artist.id !== id);

    this.albumService.removeByArtistId(id);
    this.trackService.removeByArtistId(id);
    this.favoritesService.removeReference('artists', id);
  }
}
