import * as fs from 'fs';
import {Data, DEFAULT_DATA} from "../../../common/Data";
import dotenv from 'dotenv';
import {sha256} from "js-sha256";
import {UserRole} from "../../../common/User";

dotenv.config();
const adminPasswordHash = sha256(process.env.LIB_ADMIN_PASSWORD || "123456");

export class Utils {
    private readonly dbFile: string;
    private data: Data = DEFAULT_DATA;

    constructor() {
        this.dbFile = process.env.LIB_DB_FILE || '';
        if (!this.dbFile) {
            throw "Library DB File is not defined in the .env file";
        }
        // console.log(`Database file: ${this.dbFile}`);
        this.initDatabaseConnection();
    }

    _isDatabaseExist() {
        return fs.existsSync(this.dbFile) && fs.readFileSync(this.dbFile).length !== 0;
    }

    initAuth(adminHash: string) {
        let newData: Data = this.getData();
        newData.user = [
            {id: "0", username: "Administator", email: "", password: adminHash, role: UserRole.Admin}
        ];
        this.updateData(newData);
    }

    createLibraryDatabase() {
        if (!this._isDatabaseExist()) {
            fs.writeFileSync(this.dbFile, JSON.stringify(DEFAULT_DATA, null, 4));
            console.log('Utils created successfully with default data');
            this.initAuth(adminPasswordHash);
            console.log('Auth updated successfully');
        } else {
            console.log('Utils already exists');
        }
    }

    initDatabaseConnection() {
        if (!this._isDatabaseExist()) {
            this.createLibraryDatabase();
        }
    }

    getData(): Data {
        this.data = JSON.parse(fs.readFileSync(this.dbFile, 'utf-8') || JSON.stringify(this.data));
        return this.data;
    }

    updateData(newData: Data) {
        fs.writeFileSync(this.dbFile, JSON.stringify(newData, null, 4));
        this.data = newData;
    }
}
