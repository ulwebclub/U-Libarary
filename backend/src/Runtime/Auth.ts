import {Utils} from "./Utils";
import axios from "axios";
import {BASE_URL} from "../index";
import {ElysiaCustomStatusResponse} from "elysia/dist/error";
import {UserObject, UserRole} from "../../../common/User";

export class Auth {
    db: Utils = new Utils();
    data: UserObject[] = this.db.getData().user;

    checkAuth(email: string, password : string): string {
        let allUsers = this.data;
        for (let i = 0; i < allUsers.length; i++) {
            if (allUsers[i].email === email && allUsers[i].password === password) {
                return allUsers[i].role
            }
        }
        throw "Forbidden";
    }
}

export async function verifyPermission(cookie: string, module: string): Promise<boolean> {
    try {
        const response = await axios.post(`${BASE_URL}/auth/check`, {
            cookie: cookie,
            module: module
        });
        return response.data === true;
    } catch (error) {
        console.error('Error verifying module:', error);
        return false;
    }
}

export async function checkJWT(cookie: string, module: string, error: (code: number, response?: string) => ElysiaCustomStatusResponse<number, string>) {
    if (!await verifyPermission(cookie, module)) {
        return error(401, 'Unauthorized')
    }
}