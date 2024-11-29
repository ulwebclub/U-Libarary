import {Utils} from "./Utils";
import {Data} from "../../../common/Data";
import {UserObject, UserRegisterObject, UserRole, UserUpdateObject} from "../../../common/User";
// @ts-ignore
import base64 from "base-64";

export class User {
    data: UserObject[] = [];
    db: Utils = new Utils();

    _refreshData() {
        this.data = this.db.getData().user;
    }

    _indexOf(id: string) {
        this.data = this.db.getData().user;
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].id === id) {
                return i;
            }
        }
        return -1;
    }

    _findLastUserId() {
        return this.data.length
    }

    _findUserByEmail(email: string): UserObject | null {
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].email === email) {
                return this.data[i];
            }
        }
        return null;
    }

    _isAllowedDomain(email: string) {
        let domain = email.split('@')[1];
        let allowedDomain = this.db.getData().settings.allowedDomain;
        return allowedDomain.includes(domain);
    }

    get() {
        return this.db.getData().user;
    }

    whoami(cookie: string) {
        this._refreshData()

        try {
            let decodedEmail: string = JSON.parse(base64.decode(cookie.split(".")[1])).email;
            let me = this._findUserByEmail(decodedEmail);
            if (me) me.password = "";
            return me
        } catch (e) {
            return undefined;
        }
    }

    add(obj: UserRegisterObject) {
        this._refreshData()

        if (obj.username.length === 0) {
            throw "Username should not be empty";
        }
        if (obj.email.length === 0) {
            throw "Email should not be empty";
        }
        if (obj.password.length === 0) {
            throw "Password should not be empty";
        }
        if (this._findUserByEmail(obj.email) !== null) {
            throw "Email already exists";
        }
        if (!this._isAllowedDomain(obj.email)) {
            throw "Email domain is not allowed";
        }

        let registerUser: UserObject = {
            id: this._findLastUserId().toString(),
            username: obj.username,
            email: obj.email,
            password: obj.password,
            role: UserRole.User,
            borrowedBook: [],
            reservedBook: []
        }

        this.data.push(registerUser);
        this._update();
    }

    delete(id: string) {
        this._refreshData()

        let index = this._indexOf(id);
        if (index === -1) {
            throw "User not found";
        } else if (id === "0") {
            throw "Modify Root Administrator is not allowed"
        }
        if (this.data[index].borrowedBook.length > 0) {
            throw "User has borrowed books";
        }
        if (this.data[index].reservedBook.length > 0) {
            throw "User has reserved books";
        }
        this.data.splice(index, 1);
        this._update();
    }

    update(obj: UserUpdateObject) {
        this._refreshData()

        let index = this._indexOf(obj.id);
        if (index === -1) {
            throw "User not found";
        } else if (obj.id === "0") {
            throw "Modify Root Administrator is not allowed"
        }

        let updateUser = this.data[index];
        updateUser.username = obj.username;
        updateUser.email = obj.email;
        updateUser.password = obj.password;
        updateUser.role = obj.role;

        this.data[index] = updateUser;
        this._update();
    }

    _update() {
        let newData: Data = this.db.getData();
        newData.user = this.data;
        this.db.updateData(newData);
    }
}