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

export enum UserRole {
    Admin = "Admin",
    User = "User",
}
