import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from './users/user.service';
import { UserController } from './users/user.controller';
import { AlbumsModule } from './albums/albums.module';
import { ArtistsModule } from './artists/artists.module';

@Module({
  imports: [AlbumsModule, ArtistsModule],
  controllers: [AppController, UserController],
  providers: [UserService, AppService],
})
export class AppModule {}
