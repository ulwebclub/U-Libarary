export interface User {
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
