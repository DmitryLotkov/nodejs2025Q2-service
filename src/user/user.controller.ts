import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  Put,
  Delete,
  HttpStatus,
  NotFoundException,
  Res,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserSchema, UpdatePasswordSchema } from './user.schema';
import { CreateUserDto, UpdatePasswordDto } from './user-entity';
import { ValibotPipe } from '../common/pipes/valibot.pipe';
import { Response } from 'express';

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

  @Get(':id')
  getById(@Param('id', new ParseUUIDPipe()) id: string) {
    const user = this.userService.getById(id);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  @Put(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Res() res: Response,
    @Body(new ValibotPipe(UpdatePasswordSchema)) dto: UpdatePasswordDto,
  ) {
    const user = this.userService.getById(id);

    if (!user) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'User not found' });
    }

    this.userService.update(id, dto);
    return res.status(HttpStatus.OK).send();
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', new ParseUUIDPipe()) id: string) {
    this.userService.deleteUser(id);
  }
}
