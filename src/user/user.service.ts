import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { User, CreateUserDto, UpdatePasswordDto } from './user-entity';
import { randomUUID } from 'crypto';

@Injectable()
export class UserService {
  private users: User[] = [];

  public create(userDto: CreateUserDto): Omit<User, 'password'> {
    const now = Date.now();
    const user: User = {
      id: randomUUID(),
      login: userDto.login,
      password: userDto.password,
      version: 1,
      createdAt: now,
      updatedAt: now,
    };
    this.users.push(user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...safe } = user;
    return safe;
  }

  public update(
    userId: string,
    updateUserDto: UpdatePasswordDto,
  ): Omit<User, 'password'> {
    const now = Date.now();
    const currentUser = this.users.find((user) => user.id === userId);
    if (!currentUser) {
      throw new NotFoundException('User not found');
    }

    if (currentUser.password !== updateUserDto.oldPassword) {
      throw new ForbiddenException('Old password is incorrect');
    }

    const updatedUser: User = {
      ...currentUser,
      password: updateUserDto.newPassword,
      updatedAt: now,
      version: currentUser.version + 1,
    };

    this.users = this.users.map((user) =>
      user.id === userId ? updatedUser : user,
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...safeUser } = updatedUser;
    return safeUser;
  }

  public findAll(): Omit<User, 'password'>[] {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return this.users.map(({ password, ...rest }) => rest);
  }

  public getById(userId: string): Omit<User, 'password'> {
    const currentUser = this.users.find((user) => user.id === userId);
    if (!currentUser) {
      throw new NotFoundException('User not found');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...safeUser } = currentUser;
    return safeUser;
  }

  public deleteUser(id: string): void {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    this.users.splice(index, 1);
  }
}
