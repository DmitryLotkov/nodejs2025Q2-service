import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from './users/user.service';
import { UserController } from './users/user.controller';
import { ArtistsController } from './artists/artists.controller';
import { ArtistsService } from './artists/artists.service';

@Module({
  imports: [],
  controllers: [AppController, UserController, ArtistsController],
  providers: [AppService, UserService, ArtistsService],
})
export class AppModule {}
