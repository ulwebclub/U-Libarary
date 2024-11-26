export interface Book {
    title: string;
    author: string;
    id: string;
    borrowed: boolean;
    expectReturnTime: number;
    reserved: boolean;
}
