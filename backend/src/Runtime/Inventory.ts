import {Utils} from "./Utils";
import {Data} from "../../../common/Data";
import {
    InventoryBorrowObject,
    InventoryCreateObject,
    InventoryObject,
    InventoryReturnObject
} from "../../../common/Inventory";
// @ts-ignore
import base64 from "base-64";
import {UserObject} from "../../../common/User";

export class Inventory {
    inventoryData: InventoryObject[] = [];
    userData: UserObject[] = [];
    db: Utils = new Utils();

    _refreshData() {
        this.inventoryData = this.db.getData().inventory;
        this.userData = this.db.getData().user;
    }

    _indexOfInventory(id: string) {
        this.inventoryData = this.db.getData().inventory;
        for (let i = 0; i < this.inventoryData.length; i++) {
            if (this.inventoryData[i].id === id) {
                return i;
            }
        }
        return -1;
    }

    _indexOfUserByEmail(email: string) {
        this.userData = this.db.getData().user;
        for (let i = 0; i < this.userData.length; i++) {
            if (this.userData[i].email === email) {
                return i;
            }
        }
        return -1;
    }

    _getNewId() {
        return this.db.getData().inventory.length.toString();
    }

    get() {
        return this.db.getData().inventory;
    }

    add(obj: InventoryCreateObject) {
        this._refreshData()

        let newInventory: InventoryObject = {
            title: obj.title,
            type: obj.type,
            author: obj.author,
            id: this._getNewId(),
            isbn: obj.isbn,
            borrowed: false,
            borrowedBy: "",
            expectReturnTime: "",
            reserved: false,
            reservedBy: ""
        }
        this.inventoryData.push(newInventory);
        this._update()
        return newInventory;
    }

    update(obj: InventoryObject) {
        this._refreshData()

        let index = this._indexOfInventory(obj.id);
        if (index === -1) {
            throw "Inventory Not Found"
        } else {
            this.inventoryData[index] = obj;
        }
        this._update()
    }

    delete(id: string) {
        this._refreshData()

        let index = this._indexOfInventory(id);
        if (index === -1) {
            throw "Inventory Not Found"
        } else {
            if (this.inventoryData[index].borrowed) {
                throw "Inventory is Borrowed"
            }
            if (this.inventoryData[index].reserved) {
                throw "Inventory is Reserved"
            }
            this.inventoryData.splice(index, 1);
        }
        this._update()
    }

    borrow(obj: InventoryBorrowObject, cookie: string) {
        this._refreshData()

        let indexInventory = this._indexOfInventory(obj.id);
        let indexUser = this._indexOfUserByEmail(JSON.parse(base64.decode(cookie.split(".")[1])).email);
        let decodedEmail: string = JSON.parse(base64.decode(cookie.split(".")[1])).email;
        if (indexInventory === -1) {
            throw "Inventory Not Found"
        } else {
            if (this.inventoryData[indexInventory].reserved && this.inventoryData[indexInventory].reservedBy !== decodedEmail) {
                throw "Inventory has been Reserved and not by you"
            }
            if (!this.inventoryData[indexInventory].borrowed) {
                this.inventoryData[indexInventory].borrowed = true;
                this.inventoryData[indexInventory].borrowedBy = decodedEmail;
                this.inventoryData[indexInventory].expectReturnTime = obj.expectReturnTime;
                this.userData[indexUser].borrowedBook.push(obj.id);
                if (this.userData[indexUser].reservedBook.includes(obj.id)) {
                    this.userData[indexUser].reservedBook = this.userData[indexUser].reservedBook.filter((item) => item !== obj.id);
                    this.inventoryData[indexInventory].reserved = false;
                    this.inventoryData[indexInventory].reservedBy = "";
                }
            } else if (!this.inventoryData[indexInventory].reserved) {
                this.inventoryData[indexInventory].reserved = true;
                this.inventoryData[indexInventory].reservedBy = decodedEmail;
                this.userData[indexUser].reservedBook.push(obj.id);
            } else {
                throw "Inventory has been Borrowed & Reserved"
            }
        }
        this._update()
    }

    unBorrow(obj: InventoryReturnObject, cookie: string) {
        this._refreshData()

        let indexInventory = this._indexOfInventory(obj.id);
        let indexUser = this._indexOfUserByEmail(JSON.parse(base64.decode(cookie.split(".")[1])).email);
        let decodedEmail: string = JSON.parse(base64.decode(cookie.split(".")[1])).email;
        if (indexInventory === -1) {
            throw "Inventory Not Found"
        } else {
            if (this.inventoryData[indexInventory].borrowed) {
                this.inventoryData[indexInventory].borrowed = false;
                this.inventoryData[indexInventory].borrowedBy = "";
                this.inventoryData[indexInventory].expectReturnTime = "";
                this.userData[indexUser].borrowedBook = this.userData[indexUser].borrowedBook.filter((item) => item !== obj.id);
            } else {
                throw "Inventory is not Borrowed"
            }
        }
        this._update()
    }

    _update() {
        let newData: Data = this.db.getData();
        newData.inventory = this.inventoryData;
        newData.user = this.userData;
        this.db.updateData(newData);
    }
}