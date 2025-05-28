import { object } from 'valibot';
import {shortString} from "../common/schemas/short-string";



export const CreateUserSchema = object({
    login: shortString('Login'),
    password: shortString('Password'),
});

export const UpdatePasswordSchema = object({
    oldPassword: shortString('Old password'),
    newPassword: shortString('New password'),
});