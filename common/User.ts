import {InventoryObject} from "./Inventory";

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
}

export enum UserRole {
    Admin = "Admin",
    User = "User",
}
