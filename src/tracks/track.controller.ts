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
  NotFoundException,
} from '@nestjs/common';
import { TracksService } from './tracks.service';
import { ValibotPipe } from '../common/pipes/valibot.pipe';
import { TrackDtoSchema, TrackDto } from './track-dto-schema';

@Controller('/track')
export class TrackController {
  constructor(private readonly tracksService: TracksService) {}
  @Get()
  getAll() {
    return this.tracksService.getAll();
  }

  @Get(':id')
  getById(@Param('id', new ParseUUIDPipe()) id: string) {
    const currentTrack = this.tracksService.getById(id);
    if (!currentTrack) {
      throw new NotFoundException(`Track with id ${id} not found`);
    } else {
      return currentTrack;
    }
  }

  @Post()
  create(@Body(new ValibotPipe(TrackDtoSchema)) dto: TrackDto) {
    return this.tracksService.create(dto);
  }

  @Put(':id')
  update(
    @Body(new ValibotPipe(TrackDtoSchema)) dto: TrackDto,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.tracksService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.tracksService.delete(id);
  }
}
