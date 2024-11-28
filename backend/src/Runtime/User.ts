import {Utils} from "./Utils";
import {Data} from "../../../common/Data";
import {UserObject, UserRegisterObject, UserRole, UserUpdateObject} from "../../../common/User";

export class User {
    data: UserObject[] = [];
    db: Utils = new Utils();

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

    get() {
        return this.db.getData().user;
    }

    add(obj: UserRegisterObject) {
        this.data = this.db.getData().user;

        if (obj.username.length === 0) {
            throw "Username should not be empty";
        }
        if (obj.email.length === 0) {
            throw "Email should not be empty";
        }
        if (obj.password.length === 0) {
            throw "Password should not be empty";
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
        let index = this._indexOf(id);
        if (index === -1) {
            throw "User not found";
        } else if (id === "0") {
            throw "Modify Root Administrator is not allowed"
        }
        this.data.splice(index, 1);
        this._update();
    }

    update(obj: UserUpdateObject) {
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

        this.data[index] = updateUser;
        this._update();
    }

    _update() {
        let newData: Data = this.db.getData();
        newData.user = this.data;
        this.db.updateData(newData);
    }
}