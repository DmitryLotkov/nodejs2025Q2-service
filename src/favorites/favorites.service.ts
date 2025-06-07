import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Favorites } from './favorites.entity';

@Injectable()
export class FavoritesService {
  private favorites: Favorites = {
    artists: [],
    albums: [],
    tracks: [],
  };

  public getAll(): Favorites {
    return this.favorites;
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
