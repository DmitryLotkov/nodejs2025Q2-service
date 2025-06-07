import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma/prisma.service';
import { Favorites } from './favorites.entity';

@Injectable()
export class FavoritesService {
  constructor(private readonly prismaService: PrismaService) {}
  private favorites: Favorites = {
    artists: [],
    albums: [],
    tracks: [],
  };

  public async getAll(): Promise<Favorites> {
    const favorites = await this.prismaService.favorites.findFirst({
      include: {
        tracks: {
          select: { trackId: true },
        },
        albums: {
          select: { albumId: true },
        },
        artists: {
          select: { artistId: true },
        },
      },
    });

    if (!favorites) {
      return { tracks: [], albums: [], artists: [] };
    }

    return {
      tracks: favorites.tracks.map((t) => t.trackId),
      albums: favorites.albums.map((a) => a.albumId),
      artists: favorites.artists.map((a) => a.artistId),
    };
  }

  public async addToFavorites(
    type: 'artists' | 'albums' | 'tracks',
    entityId: string,
  ): Promise<void> {
    const favorites =
      (await this.prismaService.favorites.findFirst()) ??
      (await this.prismaService.favorites.create({ data: {} }));

    if (!favorites) {
      throw new NotFoundException('Favorites not found');
    }

    if (type === 'artists') {
      const exists = await this.prismaService.favoritesOnArtists.findUnique({
        where: {
          favoritesId_artistId: {
            favoritesId: favorites.id,
            artistId: entityId,
          },
        },
      });

      if (exists) {
        throw new ConflictException('Artist already in favorites');
      }

      await this.prismaService.favoritesOnArtists.create({
        data: {
          favoritesId: favorites.id,
          artistId: entityId,
        },
      });
    } else if (type === 'albums') {
      const exists = await this.prismaService.favoritesOnAlbums.findUnique({
        where: {
          favoritesId_albumId: {
            favoritesId: favorites.id,
            albumId: entityId,
          },
        },
      });

      if (exists) {
        throw new ConflictException('Album already in favorites');
      }

      await this.prismaService.favoritesOnAlbums.create({
        data: {
          favoritesId: favorites.id,
          albumId: entityId,
        },
      });
    } else if (type === 'tracks') {
      const exists = await this.prismaService.favoritesOnTracks.findUnique({
        where: {
          favoritesId_trackId: {
            favoritesId: favorites.id,
            trackId: entityId,
          },
        },
      });

      if (exists) {
        throw new ConflictException('Track already in favorites');
      }

      await this.prismaService.favoritesOnTracks.create({
        data: {
          favoritesId: favorites.id,
          trackId: entityId,
        },
      });
    }
  }

  public async removeFromFavorites(
    type: keyof Favorites,
    id: string,
  ): Promise<void> {
    const favorites = await this.prismaService.favorites.findFirst();

    if (!favorites) {
      throw new NotFoundException('Favorites list not found');
    }

    if (type === 'tracks') {
      const existing = await this.prismaService.favoritesOnTracks.findUnique({
        where: {
          favoritesId_trackId: {
            favoritesId: favorites.id,
            trackId: id,
          },
        },
      });

      if (!existing) {
        throw new NotFoundException(`Track with id ${id} is not in favorites`);
      }

      await this.prismaService.favoritesOnTracks.delete({
        where: {
          favoritesId_trackId: {
            favoritesId: favorites.id,
            trackId: id,
          },
        },
      });

      return;
    }

    if (type === 'albums') {
      const existing = this.prismaService.favoritesOnAlbums.findUnique({
        where: {
          favoritesId_albumId: {
            favoritesId: favorites.id,
            albumId: id,
          },
        },
      });

      if (!existing) {
        throw new NotFoundException(`Album with id ${id} is not in favorites`);
      }

      await this.prismaService.favoritesOnAlbums.delete({
        where: {
          favoritesId_albumId: {
            favoritesId: favorites.id,
            albumId: id,
          },
        },
      });
    }

    if (type === 'artists') {
      const existing = this.prismaService.favoritesOnArtists.findUnique({
        where: {
          favoritesId_artistId: {
            favoritesId: favorites.id,
            artistId: id,
          },
        },
      });

      if (!existing) {
        throw new NotFoundException(`Artist with id ${id} is not in favorites`);
      }

      await this.prismaService.favoritesOnArtists.delete({
        where: {
          favoritesId_artistId: {
            favoritesId: favorites.id,
            artistId: id,
          },
        },
      });
    }
  }

  public removeReference(type: keyof Favorites, id: string): void {
    this.favorites[type] = this.favorites[type].filter((favId) => favId !== id);
  }
}
