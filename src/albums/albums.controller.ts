import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Body,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { ValibotPipe } from '../common/pipes/valibot.pipe';
import { AlbumDtoSchema, AlbumDto } from './album-dto-schema';
import { albumsRoutes } from '../../test/endpoints';

@Controller(albumsRoutes.getAll)
export class AlbumsController {
  constructor(private readonly albumService: AlbumsService) {}

  @Get()
  getAll() {
    return this.albumService.getAll();
  }

  @Get(':id')
  getAlbum(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.albumService.getById(id);
  }

  @Post()
  createAlbum(@Body(new ValibotPipe(AlbumDtoSchema)) dto: AlbumDto) {
    return this.albumService.create(dto);
  }

  @Put(':id')
  updateAlbum(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new ValibotPipe(AlbumDtoSchema)) dto: AlbumDto,
  ) {
    return this.albumService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', new ParseUUIDPipe()) id: string) {
    this.albumService.delete(id);
  }
}
