import {UserObject} from "./User";
import {InventoryObject} from "./Inventory";

export interface Data {
    libraryName: string;
    settings: {
        "allowedDomain": string[]
    }
    user: UserObject[];
    inventory: InventoryObject[]
}

export const DEFAULT_DATA: Data = {
    libraryName: "",
    settings: {
        allowedDomain: []
    },
    user: [],
    inventory: []
}