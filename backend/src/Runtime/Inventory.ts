import {Utils} from "./Utils";
import {Data} from "../../../common/Data";
import {InventoryBorrowObject, InventoryObject} from "../../../common/Inventory";

export class Inventory {
    data: InventoryObject[] = [];
    db: Utils = new Utils();

    _indexOf(id: string) {
        this.data = this.db.getData().inventory;
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].id === id) {
                return i;
            }
        }
        return -1;
    }

    _findBooksWithISBN(isbn: string) {
        let allBooks: InventoryObject[] = this.db.getData().inventory;
        let matchBooks: InventoryObject[] = [];

        allBooks.forEach(book => {
            if (book.isbn === isbn) {
                matchBooks.push(book);
            }
        });

        return matchBooks;
    }

    _findFirstAvailableBook(isbn: string) {
        let allBooksWithISBN = this._findBooksWithISBN(isbn);
        if (allBooksWithISBN.length === 0) {
            return ""
        } else {
            allBooksWithISBN.forEach(book => {
                if (!book.borrowed) {
                    return book.id;
                }
            })
        }
        return ""
    }

    get() {
        return this.db.getData().inventory;
    }

    borrow(obj: InventoryBorrowObject) {
        let borrowBookId = this._findFirstAvailableBook(obj.isbn);
        let borrowBookIndex = this._indexOf(borrowBookId)
        let borrowBook = this.db.getData().inventory[borrowBookIndex];
        if (borrowBookId !== "") {
            borrowBook.borrowed = true;
            borrowBook.expectReturnTime = obj.expectReturnTime;
        }

        this.data[borrowBookIndex] = borrowBook;
        this._update()
    }

    _update() {
        let newData: Data = this.db.getData();
        newData.inventory = this.data;
        this.db.updateData(newData);
    }
}