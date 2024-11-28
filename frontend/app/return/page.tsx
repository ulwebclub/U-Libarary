"use client"

import * as React from "react";
import {useState} from "react";
import {DataGrid} from "@mui/x-data-grid";
import {Box, Button, darken, lighten, PaletteColor, styled, Theme} from "@mui/material";
import {InventoryObject, InventoryType} from "../../../common/Inventory";

export interface BorrowedInventoryObject extends InventoryObject {
    overdue: string;
}

const cols = [
    {field: "id", headerName: "ID", width: 60},
    {field: "title", headerName: "Title", width: 240},
    {field: "author", headerName: "Author", width: 165},
    {field: "type", headerName: "Type", width: 60},
    {field: "isbn", headerName: "ISBN", width: 135},
    {field: "overdue", headerName: "Overdue?", width: 80},
];

function isOverdue(item: InventoryObject) {
    const now = new Date();
    const expectReturnTime = new Date(item.expectReturnTime);
    return now > expectReturnTime ? "Yes" : "No";
}

/*
{title: "Book 1", type: "Book", author: "Author 1", id: "1", isbn: "9788175257665", overdue: true}
*/

const paginationModel = { page: 0, pageSize: 10 };

const getBackgroundColor = (color: string, theme: Theme, coefficient: number) => ({
    backgroundColor: darken(color, coefficient),
    ...theme.applyStyles('light', {
        backgroundColor: lighten(color, coefficient),
    }),
});

const ReturnDataGrid = styled(DataGrid)(({theme}) => ({
    '& .highlighted-row': {
        ...getBackgroundColor(theme.palette.warning.main, theme, 0.7),
        '&:hover': {
            ...getBackgroundColor(theme.palette.warning.main, theme, 0.6),
        },
        '&.Mui-selected': {
            ...getBackgroundColor(theme.palette.warning.main, theme, 0.5),
        '&:hover': {
            ...getBackgroundColor(theme.palette.warning.main, theme, 0.4),
            },
        },
    },
}));

export default function Page(){
    // const temp1: InventoryObject = {
    //     borrowedBy: "",
    //     reservedBy: "",
    //     title: "Book 1", type: InventoryType.Book, author: "Author 1", id: "1", isbn: "9788175257665", borrowed: true, expectReturnTime: "2024-10-27T09:00:00", reserved: false}
    // const temp2: BorrowedInventoryObject = {
    //     ...temp1,
    //     overdue: isOverdue(temp1)
    // };
    //
    // const temp3: InventoryObject = {
    //     borrowedBy: "",
    //     reservedBy: "",
    //     title: "Book 1", type: InventoryType.Book, author: "Author 1", id: "8", isbn: "9788113257665", borrowed: true, expectReturnTime: "2024-12-27T09:00:00", reserved: false}
    // const temp4: BorrowedInventoryObject = {
    //     ...temp3,
    //     overdue: isOverdue(temp3)
    // };

    const [items, setItems] = useState<BorrowedInventoryObject[]>([]);


    // @ts-ignore
    return (
        <Box sx = {{
            height: '100%', width: '80%', minWidth: 400,
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            gap: 2, p: 3
        }}>
            <ReturnDataGrid
                columns={cols}
                rows={items}
                pageSizeOptions={[10, 25, 50, 100]}
                initialState={{pagination: {paginationModel}}}
                checkboxSelection={true}
                hideFooterSelectedRowCount={false}
                sx={{
                    width: '100%',
                    minWidth: 375
                }}
                getRowClassName={(params) => params.row.overdue == "Yes" ? 'highlighted-row' : ''}
            />
            <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', width: '100%'}}>
                <Button
                    variant = "contained"
                >
                    Return selected
                </Button>
            </Box>
        </Box>
    );
}