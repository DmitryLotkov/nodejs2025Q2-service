import { Injectable, NotFoundException } from '@nestjs/common';
import { Artist } from './artist.entity';
import { ArtistDto } from './artist.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class ArtistsService {
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

    //this.albumService.unlinkArtist(id);   // TODO: реализовать
    //this.trackService.unlinkArtist(id);  // TODO: реализовать
    //this.favoritesService.removeArtist(id); // TODO: реализовать
  }
}
