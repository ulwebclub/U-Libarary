import {Utils} from "./Utils";
import {Data} from "../../../common/Data";
import {UserObejct} from "../../../common/User";

export class User {
    data: UserObejct[] = [];
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

    get() {
        return this.db.getData().user;
    }

    delete(id: string) {
        let index = this._indexOf(id);
        if (index === -1) {
            throw "User not found";
        }
        this.data.splice(index, 1);
        this._update();
    }

    update(obj: UserObejct) {
        let index = this._indexOf(obj.id);
        if (index === -1) {
            throw "User not found";
        }
        this.data[index] = obj;
        this._update();
    }

    _update() {
        let newData: Data = this.db.getData();
        newData.user = this.data;
        this.db.updateData(newData);
    }
}