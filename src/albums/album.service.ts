import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { Album } from './album.entity';
import { randomUUID } from 'crypto';
import { AlbumDto } from './album-dto-schema';
import { ArtistsService } from '../artists/artists.service';

@Injectable()
export class AlbumService {
  constructor(
    @Inject(forwardRef(() => ArtistsService))
    private readonly artistsService: ArtistsService,
  ) {}
  private albums: Album[] = [];

  public getAll(): Album[] {
    return this.albums;
  }

  public getById(id: string): Album {
    const album = this.albums.find((album) => album.id === id);
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    return album;
  }

  public create(dto: AlbumDto): Album {
    if (dto.artistId !== null) {
      this.artistsService.findById(dto.artistId);
    }

    const album: Album = {
      id: randomUUID(),
      name: dto.name,
      year: dto.year,
      artistId: dto.artistId ?? null,
    };

    this.albums.push(album);
    return album;
  }

  public update(albumId: string, dto: AlbumDto): Album {
    if (dto.artistId !== null) {
      this.artistsService.findById(dto.artistId);
    }
    const index = this.albums.findIndex((album) => album.id === albumId);
    if (index === -1) {
      throw new NotFoundException('Album not found');
    }

    const updatedAlbum: Album = {
      ...this.albums[index],
      name: dto.name,
      year: dto.year,
      artistId: dto.artistId ?? null,
    };

    this.albums[index] = updatedAlbum;
    return updatedAlbum;
  }

  public delete(id: string) {
    const index = this.albums.findIndex((album) => album.id === id);
    if (index === -1) {
      throw new NotFoundException('Album not found');
    }

    this.albums.splice(index, 1);
  }

  public removeByArtistId(artistId: string): void {
    this.albums = this.albums.map((album) =>
      album.artistId === artistId ? { ...album, artistId: null } : album,
    );
  }
}
