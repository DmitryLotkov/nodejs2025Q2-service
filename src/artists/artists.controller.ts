import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  NotFoundException,
  Post,
  Body,
  Delete,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { ValibotPipe } from '../common/pipes/valibot.pipe';
import { CreateArtistSchema } from './artist-schema';
import { ArtistDto } from './artist.entity';

@Controller('/artist')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}
  @Get()
  getArtists() {
    return this.artistsService.findAll();
  }

  @Get(':id')
  getArtist(@Param('id', new ParseUUIDPipe()) id: string) {
    const artist = this.artistsService.getById(id);
    if (!artist) {
      throw new NotFoundException();
    }

    return artist;
  }

  @Post()
  createArtist(@Body(new ValibotPipe(CreateArtistSchema)) dto: ArtistDto) {
    return this.artistsService.create(dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteArtist(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.artistsService.delete(id);
  }

  @Put(':id')
  updateUser(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new ValibotPipe(CreateArtistSchema)) dto: ArtistDto,
  ) {
    return this.artistsService.update(id, dto);
  }
}
