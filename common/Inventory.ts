export interface InventoryObject {
    title: string;
    type: InventoryType,
    author: string;
    id: string;
    isbn: string;
    borrowed: boolean;
    borrowedBy: string;
    expectReturnTime: string;
    reserved: boolean;
    reservedBy: string;
}

export enum InventoryType {
    Book = 'Book',
    CD = 'CD'
}

export interface InventoryBorrowObject {
    id: string;
    expectReturnTime: string;
}

export interface InventoryReturnObject {
    id: string;
}
