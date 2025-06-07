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
        artists: { select: { id: true } },
        albums: { select: { id: true } },
        tracks: { select: { id: true } },
      },
    });

    if (!favorites) {
      return { artists: [], albums: [], tracks: [] };
    }

    return {
      artists: favorites.artists.map((artist) => artist.id),
      albums: favorites.albums.map((album) => album.id),
      tracks: favorites.tracks.map((track) => track.id),
    };
  }

  public addToFavorites(type: keyof Favorites, id: string): void {
    const list = this.favorites[type];

    if (list.includes(id)) {
      throw new ConflictException(
        `${this.entityLabel(type)} already in favorites`,
      );
    }

    list.push(id);
  }

  public removeFromFavorites(type: keyof Favorites, id: string): void {
    const list = this.favorites[type];
    const index = list.indexOf(id);

    if (index === -1) {
      throw new NotFoundException(
        `${this.entityLabel(type)} with id ${id} is not in favorites`,
      );
    }

    list.splice(index, 1);
  }

  public removeReference(type: keyof Favorites, id: string): void {
    this.favorites[type] = this.favorites[type].filter((favId) => favId !== id);
  }

  private entityLabel(type: keyof Favorites): string {
    return type.slice(0, -1).replace(/^./, (c) => c.toUpperCase());
  }
}
