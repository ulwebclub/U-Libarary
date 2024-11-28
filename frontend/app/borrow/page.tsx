"use client"

import * as React from "react";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {Box, Button} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import {useState} from "react";
import {InventoryObject, InventoryType} from "../../../common/Inventory";

const cols = [
    {field: "id", headerName: "ID", width: 60},
    {field: "title", headerName: "Title", width: 240, minWidth: 240, flex: 1},
    {field: "author", headerName: "Author", width: 165, flex: 0},
    {field: "type", headerName: "Type", width: 60},
    {field: "isbn", headerName: "ISBN", width: 135},
    {field: "borrowed", headerName: "Borrowed?", width: 90,
        renderCell: (params) => (
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center", // Center vertically
                    justifyContent: "center", // Center horizontally
                    width: "100%",
                    height: "100%",
                }}
            >
                {params.value ? (
                    <CheckIcon style={{ color: "green" }} />
                ) : (
                    <CloseIcon style={{ color: "red" }} />
                )}
            </Box>
        ),
    },
    {field: "expectReturnTime", headerName: "Expected return time", width: 150},
    {field: "reserved", headerName: "Reserved?", width: 90,
        renderCell: (params) => (
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center", // Center vertically
                    justifyContent: "center", // Center horizontally
                    width: "100%",
                    height: "100%",
                }}
            >
                {params.value ? (
                    <CheckIcon style={{ color: "green" }} />
                ) : (
                    <CloseIcon style={{ color: "red" }} />
                )}
            </Box>
        ),
    },
];

/*
{title: "Book 1", type: "Book", author: "Author 1", id: "1", isbn: "9788175257665", borrowed: true,
expectReturnTime: "2024/12/31", reserved: false}
*/

const paginationModel = { page: 0, pageSize: 10 };

export default function Page(){
    const [items, setItems] = useState<InventoryObject[]>([{title: "Book 1", type: "Book", author: "Author 1", id: "1", isbn: "9788175257665", borrowed: true,
        expectReturnTime: "2024/12/31", reserved: false}, {title: "Book 2", type: "Book", author: "Author 2", id: "2", isbn: "9788175257665", borrowed: true,
        expectReturnTime: "2024/12/31", reserved: false}]);

    return (
        <Box sx = {{
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            //zIndex: 'tooltip',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <DataGrid
                columns = {cols}
                rows = {items}
                pageSizeOptions = {[10, 25, 50, 100]}
                initialState = {{pagination: {paginationModel}}}
                checkboxSelection = {true}
                hideFooterSelectedRowCount = {false}
                sx = {{width: '90%', minWidth: 375}}
            />

            <Box sx = {{width: '90%', display: "flex", justifyContent: 'flex-end', alignItems: 'right', pt: 1}}>
                <Button
                    variant = "contained"
                >
                    Borrow selected
                </Button>
            </Box>
        </Box>
    );
}