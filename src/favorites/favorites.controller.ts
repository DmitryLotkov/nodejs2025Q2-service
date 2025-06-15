import {
  Controller,
  Get,
  Post,
  Param,
  ParseUUIDPipe,
  NotFoundException,
  UnprocessableEntityException,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ArtistsService } from '../artists/artists.service';
import { TracksService } from '../tracks/tracks.service';
import { AlbumsService } from '../albums/albums.service';
import { FavoritesService } from './favorites.service';
import { FavoritesResponse } from './favorites.entity';

@Controller('favs')
export class FavoritesController {
  constructor(
    private readonly favoritesService: FavoritesService,
    private readonly artistsService: ArtistsService,
    private readonly tracksService: TracksService,
    private readonly albumService: AlbumsService,
  ) {}
  @Get()
  async getAll(): Promise<FavoritesResponse> {
    const favorites = await this.favoritesService.getAll();
    async function safeGet<T>(getter: () => Promise<T>): Promise<T | null> {
      try {
        return await getter();
      } catch {
        return null;
      }
    }

    const artists = await Promise.all(
      favorites.artists.map((id) =>
        safeGet(() => this.artistsService.getById(id)),
      ),
    ).then((res) => res.filter(Boolean)); // [Artist]

    const albums = await Promise.all(
      favorites.albums.map((id) =>
        safeGet(() => this.albumService.getById(id)),
      ),
    ).then((res) => res.filter(Boolean)); // [Album]

    const tracks = await Promise.all(
      favorites.tracks.map((id) =>
        safeGet(() => this.tracksService.getById(id)),
      ),
    ).then((res) => res.filter(Boolean)); // [Track]

    return { artists, albums, tracks };
  }

  @Post('track/:id')
  async addTrackToFavorites(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      await this.tracksService.getById(id);
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw new UnprocessableEntityException(
          `Track with id ${id} does not exist`,
        );
      }
      throw err;
    }
    await this.favoritesService.addToFavorites('tracks', id);

    return { message: 'Track added to favorites' };
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteTrackFromFavorites(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.favoritesService.removeFromFavorites('tracks', id);
  }

  @Post('album/:id')
  async addAlbumToFavorites(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      await this.albumService.getById(id);
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw new UnprocessableEntityException(
          `Album with id ${id} does not exist`,
        );
      }
      throw err;
    }
    await this.favoritesService.addToFavorites('albums', id);

    return { message: 'Album added to favorites' };
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteAlbumFromFavorites(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.favoritesService.removeFromFavorites('albums', id);
  }

  @Post('artist/:id')
  async addArtistToFavorites(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      await this.artistsService.getById(id);
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw new UnprocessableEntityException(
          `Artist with id ${id} does not exist`,
        );
      }
      throw err;
    }

    await this.favoritesService.addToFavorites('artists', id);
    return { message: 'Artist added to favorites' };
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteArtistFromFavorites(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.favoritesService.removeFromFavorites('artists', id);
  }
}
