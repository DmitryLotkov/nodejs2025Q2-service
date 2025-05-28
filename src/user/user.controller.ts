import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserSchema } from './user.schema';
import { CreateUserDto } from './user-entity';
import { ValibotPipe } from '../common/pipes/valibot.pipe';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAll() {
    return this.userService.findAll();
  }

  @Post()
  create(@Body(new ValibotPipe(CreateUserSchema)) dto: CreateUserDto) {
    return this.userService.create(dto);
  }
}
