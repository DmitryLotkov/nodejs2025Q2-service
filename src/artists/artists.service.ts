import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { Artist, ArtistDto } from './artist.entity';
import { AlbumsService } from '../albums/albums.service';
import { TracksService } from '../tracks/tracks.service';
import { FavoritesService } from '../favorites/favorites.service';
import { PrismaService } from '../prisma/prisma/prisma.service';

@Injectable()
export class ArtistsService {
  constructor(
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
    private readonly trackService: TracksService,
    @Inject(forwardRef(() => AlbumsService))
    private readonly albumService: AlbumsService,
    private prismaService: PrismaService,
  ) {}

  public async findAll(): Promise<Artist[]> {
    return this.prismaService.artist.findMany();
  }

  public async getById(id: string): Promise<Artist> {
    const artist = await this.prismaService.artist.findUnique({
      where: {
        id,
      },
    });
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    return artist;
  }

  public async create(dto: ArtistDto): Promise<Artist> {
    return this.prismaService.artist.create({
      data: {
        grammy: dto.grammy,
        name: dto.name,
      },
    });
  }

  public async update(id: string, dto: ArtistDto): Promise<Artist> {
    const artist = await this.prismaService.artist.findUnique({
      where: {
        id,
      },
    });

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    return this.prismaService.artist.update({
      where: {
        id,
      },
      data: {
        grammy: dto.grammy,
        name: dto.name,
      },
    });
  }

  public async delete(id: string): Promise<void> {
    const everExisted = await this.prismaService.artist.findUnique({
      where: { id },
    });

    if (!everExisted) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }

    await this.albumService.removeByArtistId(id);
    await this.trackService.removeByArtistId(id);
    await this.favoritesService.removeReference('artists', id);

    await this.prismaService.artist.delete({
      where: { id },
    });
  }
}
