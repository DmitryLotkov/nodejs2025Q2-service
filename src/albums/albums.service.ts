import {
  NotFoundException,
  Injectable,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { AlbumDto } from './album-dto-schema';
import { ArtistsService } from '../artists/artists.service';
import { FavoritesService } from '../favorites/favorites.service';
import { TracksService } from '../tracks/tracks.service';
import { PrismaService } from '../prisma/prisma/prisma.service';
import { Album } from '@prisma/client';

@Injectable()
export class AlbumsService {
  constructor(
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
    private readonly trackService: TracksService,
    @Inject(forwardRef(() => ArtistsService))
    private readonly artistsService: ArtistsService,
    private readonly prismaService: PrismaService,
  ) {}

  public async getAll(): Promise<Album[]> {
    return this.prismaService.album.findMany();
  }

  public async getById(id: string): Promise<Album> {
    const album = await this.prismaService.album.findUnique({ where: { id } });
    if (!album) throw new NotFoundException('Album not found');
    return album;
  }

  public async create(dto: AlbumDto): Promise<Album> {
    if (dto.artistId != null) {
      await this.artistsService.getById(dto.artistId);
    }

    return this.prismaService.album.create({
      data: {
        name: dto.name,
        year: dto.year,
        artistId: dto.artistId ?? null,
      },
    });
  }

  public async update(albumId: string, dto: AlbumDto): Promise<Album> {
    if (dto.artistId != null) {
      await this.artistsService.getById(dto.artistId);
    }

    const album = await this.prismaService.album.findUnique({
      where: { id: albumId },
    });
    if (!album) throw new NotFoundException('Album not found');

    return this.prismaService.album.update({
      where: { id: albumId },
      data: {
        name: dto.name,
        year: dto.year,
        artistId: dto.artistId ?? null,
      },
    });
  }

  public async delete(id: string): Promise<void> {
    const album = await this.prismaService.album.findUnique({ where: { id } });
    if (!album) {
      throw new NotFoundException('Album not found');
    }

    await this.prismaService.album.delete({ where: { id } });

    await this.trackService.removeByAlbumId(id);
    await this.favoritesService.removeReference('albums', id);
  }

  public async removeByArtistId(artistId: string): Promise<void> {
    await this.prismaService.album.updateMany({
      where: { artistId },
      data: { artistId: null },
    });
  }
}
