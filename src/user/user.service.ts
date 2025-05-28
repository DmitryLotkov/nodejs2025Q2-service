import {Injectable, NotFoundException, ForbiddenException} from '@nestjs/common';
import {User, CreateUserDto, UpdatePasswordDto} from "./user-entity";
import { randomUUID } from 'crypto';

@Injectable()
export class UserService {
    private users: User[] = [];

    create(userDto:CreateUserDto): Omit<User, 'password'> {
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
        const { password: _, ...safe } = user;
        return safe;
    }

    update(userId:string, updateUserDto: UpdatePasswordDto){
        const now = Date.now();
        const currentUser = this.users.find((user) => user.id === userId)
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

        const { password: _, ...safeUser } = updatedUser;
        return safeUser;
    }

    findAll() {
        return this.users.map(({ password, ...rest }) => rest);
    }
}
