import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateUserDto, UpdatePasswordDto, User } from './user-entity';
import { PrismaService } from '../prisma/prisma/prisma.service';
import { User as PrismaUser } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as process from 'node:process';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  public async create(userDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const user = await this.prisma.user.create({
      data: {
        login: userDto.login,
        password: userDto.password,
        version: 1,
      },
    });

    return this.serializeUser(user);
  }

  async signUp(dto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const salt = Number(process.env.CRYPT_SALT) ?? 10;
    const hashedPassword = await bcrypt.hash(dto.password, salt);
    const user = await this.prisma.user.create({
      data: {
        login: dto.login,
        password: hashedPassword,
        version: 1,
      },
    });

    return this.serializeUser(user);
  }

  public async findByLogin(login: string): Promise<PrismaUser[]> {
    return this.prisma.user.findMany({ where: { login } });
  }

  public async update(
    userId: string,
    updateUserDto: UpdatePasswordDto,
  ): Promise<Omit<User, 'password'>> {
    const currentUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!currentUser) {
      throw new NotFoundException('User not found');
    }

    if (currentUser.password !== updateUserDto.oldPassword) {
      throw new ForbiddenException('Old password is incorrect');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: updateUserDto.newPassword,
        version: currentUser.version + 1,
      },
    });

    return this.serializeUser(updatedUser);
  }

  public async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.prisma.user.findMany();
    return users.map(this.serializeUser);
  }

  public async getById(userId: string): Promise<Omit<User, 'password'>> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.serializeUser(user);
  }

  public async deleteUser(id: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    await this.prisma.user.delete({ where: { id } });
  }

  private serializeUser(user: PrismaUser): Omit<User, 'password'> & {
    createdAt: number;
    updatedAt: number;
  } {
    const { id, login, version, createdAt, updatedAt } = user;

    return {
      id,
      login,
      version,
      createdAt: createdAt.getTime(),
      updatedAt: updatedAt.getTime(),
    };
  }
}
