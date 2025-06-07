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
  getAll(): FavoritesResponse {
    const favorites = this.favoritesService.getAll();

    const artists = favorites.artists
      .map((id) => this.artistsService.getById(id))
      .filter(Boolean);

    const albums = favorites.albums
      .map((id) => this.albumService.getById(id))
      .filter(Boolean);

    const tracks = favorites.tracks
      .map((id) => this.tracksService.getById(id))
      .filter(Boolean);

    return { artists, albums, tracks };
  }

  @Post('track/:id')
  addTrackToFavorites(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      this.tracksService.getById(id);
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw new UnprocessableEntityException(
          `Track with id ${id} does not exist`,
        );
      }
      throw err;
    }
    this.favoritesService.addToFavorites('tracks', id);

    return { message: 'Track added to favorites' };
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteTrackFromFavorites(@Param('id', new ParseUUIDPipe()) id: string) {
    this.favoritesService.removeFromFavorites('tracks', id);
  }

  @Post('album/:id')
  addAlbumToFavorites(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      this.albumService.getById(id);
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw new UnprocessableEntityException(
          `Album with id ${id} does not exist`,
        );
      }
      throw err;
    }
    this.favoritesService.addToFavorites('albums', id);

    return { message: 'Album added to favorites' };
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteAlbumFromFavorites(@Param('id', new ParseUUIDPipe()) id: string) {
    this.favoritesService.removeFromFavorites('albums', id);
  }

  @Post('artist/:id')
  addArtistToFavorites(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      this.artistsService.getById(id);
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw new UnprocessableEntityException(
          `Artist with id ${id} does not exist`,
        );
      }
      throw err;
    }

    this.favoritesService.addToFavorites('artists', id);
    return { message: 'Artist added to favorites' };
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteArtistFromFavorites(@Param('id', new ParseUUIDPipe()) id: string) {
    this.favoritesService.removeFromFavorites('artists', id);
  }
}
