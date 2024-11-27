export interface InventoryObject {
    title: string;
    type: InventoryType,
    author: string;
    id: string;
    isbn: string;
    borrowed: boolean;
    expectReturnTime: string;
    reserved: boolean;
}

export enum InventoryType {
    Book = 'Book',
    CD = 'CD'
}

export interface InventoryBorrowObject {
    isbn: string;
    expectReturnTime: string;
}
