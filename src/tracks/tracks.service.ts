import {
  Injectable,
  NotFoundException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { TrackDto } from './track-dto-schema';
import { FavoritesService } from '../favorites/favorites.service';
import { PrismaService } from '../prisma/prisma/prisma.service';
import { Track } from '@prisma/client';

@Injectable()
export class TracksService {
  constructor(
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
    private readonly prismaService: PrismaService,
  ) {}

  public async getAll(): Promise<Track[]> {
    return this.prismaService.track.findMany();
  }

  public async getById(id: string): Promise<Track> {
    const currentTrack = await this.prismaService.track.findUnique({
      where: { id },
    });

    if (!currentTrack) {
      throw new NotFoundException('Track not found');
    }

    return currentTrack;
  }

  public async create(dto: TrackDto): Promise<Track> {
    return this.prismaService.track.create({
      data: {
        albumId: dto.albumId,
        artistId: dto.artistId,
        name: dto.name,
        duration: dto.duration,
      },
    });
  }

  public async update(id: string, dto: TrackDto): Promise<Track> {
    await this.getById(id);

    return this.prismaService.track.update({
      where: { id },
      data: {
        duration: dto.duration,
        name: dto.name,
        artistId: dto.artistId,
        albumId: dto.albumId,
      },
    });
  }

  public async delete(id: string): Promise<void> {
    const track = await this.prismaService.track.findUnique({ where: { id } });
    if (!track) throw new NotFoundException(`Track with id ${id} not found`);

    await this.favoritesService.removeReference('tracks', id);

    await this.prismaService.track.delete({
      where: { id },
    });
  }

  public async removeByAlbumId(albumId: string): Promise<void> {
    await this.prismaService.track.updateMany({
      where: { albumId },
      data: { albumId: null },
    });
  }

  public async removeByArtistId(artistId: string): Promise<void> {
    await this.prismaService.track.updateMany({
      where: { artistId },
      data: { artistId: null },
    });
  }
}
