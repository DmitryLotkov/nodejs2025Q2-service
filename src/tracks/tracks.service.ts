import { Injectable, NotFoundException } from '@nestjs/common';
import { Track } from './track.entity';
import { randomUUID } from 'crypto';
import { TrackDto } from './track-dto-schema';

@Injectable()
export class TracksService {
  private tracks: Track[] = [];

  public getAll(): Track[] {
    return this.tracks;
  }

  public getById(id: string): Track {
    const currentTrack = this.tracks.find((track) => track.id === id);
    if (!currentTrack) {
      throw new NotFoundException('Track not found');
    }

    return currentTrack;
  }

  public create(dto: TrackDto): Track {
    const track: Track = {
      id: randomUUID(),
      albumId: dto.albumId,
      artistId: dto.artistId,
      name: dto.name,
      duration: dto.duration,
    };
    this.tracks.push(track);

    return track;
  }

  public update(id: string, dto: TrackDto): Track {
    const currentTrack = this.getById(id);

    const updatedTrack: Track = {
      id: currentTrack.id,
      duration: dto.duration,
      name: dto.name,
      artistId: dto.artistId,
      albumId: dto.albumId,
    };

    this.tracks = this.tracks.map((user) =>
      user.id === id ? updatedTrack : user,
    );

    return updatedTrack;
  }

  public delete(id: string): void {
    const index = this.tracks.findIndex((track) => track.id === id);
    if (index === -1) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }

    this.tracks.splice(index, 1);
  }

  public removeByAlbumId(albumId: string): void {
    this.tracks = this.tracks.map((track) =>
      track.albumId === albumId ? { ...track, albumId: null } : track,
    );
  }

  public removeByArtistId(artistId: string): void {
    this.tracks = this.tracks.map((track) =>
      track.artistId === artistId ? { ...track, artistId: null } : track,
    );
  }
}
