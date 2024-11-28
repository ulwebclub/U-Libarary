"use client"

import * as React from "react";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {Box, Button} from "@mui/material";
import {useState} from "react";
import {InventoryObject, InventoryType} from "../../../common/Inventory";

const cols = [
    {field: "id", headerName: "ID", width: 60},
    {field: "title", headerName: "Title", width: 240},
    {field: "author", headerName: "Author", width: 165},
    {field: "type", headerName: "Type", width: 60},
    {field: "isbn", headerName: "ISBN", width: 135},
    {field: "borrowed", headerName: "Borrowed?", width: 90},
    {field: "expectReturnTime", headerName: "Expected return time", width: 120},
    {field: "reserved", headerName: "Reserved?", width: 90},
];

/*
{title: "Book 1", type: "Book", author: "Author 1", id: "1", isbn: "9788175257665", borrowed: true,
expectReturnTime: "2024/12/31", reserved: false}
*/

const paginationModel = { page: 0, pageSize: 10 };

export default function Page(){
    const [items, setItems] = useState<InventoryObject[]>([]);

    return (
        <Box sx = {{width: '90%', minWidth: 375, justifyContent: 'center', alignItems: 'center'}}>
            <DataGrid
                columns = {cols}
                rows = {items}
                pageSizeOptions = {[10, 25, 50, 100]}
                initialState = {{pagination: {paginationModel}}}
                checkboxSelection = {true}
                hideFooterSelectedRowCount = {false}
                sx = {{width: '100%', minWidth: 375}}
            />
            <Box sx = {{width: '100%', justifyContent: 'left', alignItems: 'left', pt: 2}}>
                <Button
                    variant = "contained"
                >
                    Borrow selected
                </Button>
            </Box>
        </Box>
    );
}