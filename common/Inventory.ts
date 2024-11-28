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

export interface InventoryCreateObject {
    type: InventoryType;
    isbn: string;
    author: string;
    title: string;
}

export interface InventoryBorrowObject {
    id: string;
    expectReturnTime: string;
}

export interface InventoryReturnObject {
    id: string;
}

export const EMPTY_INVENTORY: InventoryObject = {
    title: '',
    type: InventoryType.Book,
    author: '',
    id: '',
    isbn: '',
    borrowed: false,
    borrowedBy: '',
    expectReturnTime: '',
    reserved: false,
    reservedBy: ''
}
