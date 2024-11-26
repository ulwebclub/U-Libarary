import {Book} from "./book";
import {CD} from "./cd";
import {User} from "./user";

export interface Library {
    items: (Book | CD)[],
    users: User[]
}
