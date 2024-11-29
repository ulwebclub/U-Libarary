export interface UserObject {
    id: string;
    username: string;
    email: string;
    password: string;
    role: UserRole;
    borrowedBook: string[];
    reservedBook: string[];
}

export interface UserRegisterObject {
    username: string;
    email: string;
    password: string;
}

export interface UserUpdateObject {
    id: string;
    username: string;
    email: string;
    password: string;
    role: UserRole;
}

export enum UserRole {
    Admin = "Admin",
    User = "User",
}

export const EMPTY_USER: UserObject = {
    id: "",
    username: "",
    email: "",
    password: "",
    role: UserRole.User,
    borrowedBook: [],
    reservedBook: []
}