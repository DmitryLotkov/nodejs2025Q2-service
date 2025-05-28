export interface User {
    id: string;
    login: string;
    password: string;
    version: number;
    createdAt: number;
    updatedAt: number;
}

export  interface UpdatePasswordDto {
    oldPassword: string; // previous password
    newPassword: string; // new password
}

export interface CreateUserDto {
    login: string;
    password: string;
}