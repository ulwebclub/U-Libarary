"use client"

import * as React from "react";
import {useEffect, useState} from "react";
import {DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarQuickFilter} from "@mui/x-data-grid";
import {Box, Button, Stack} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import {InventoryObject} from "../../../common/Inventory";
import {getReq, postReq} from "@/app/net";
import {toast} from "react-toastify";
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const cols = [
    {field: "id", headerName: "ID", width: 60},
    {field: "title", headerName: "Title", minWidth: 240, flex: 1},
    {field: "author", headerName: "Author", width: 165, flex: 0},
    {field: "type", headerName: "Type", width: 60},
    {field: "isbn", headerName: "ISBN", width: 135},
    {field: "borrowed", headerName: "Borrowed by others?", width: 150,
        renderCell: (params: any) => (
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
                    <CloseIcon style={{ color: "#d00000" }} />
                )}
            </Box>
        ),
    },
    {field: "reserved", headerName: "Reserved?", width: 90,
        renderCell: (params: any) => (
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
                    <CloseIcon style={{ color: "#d00000" }} />
                )}
            </Box>
        ),
    },
];

const paginationModel = { page: 0, pageSize: 10 };

export default function Page() {
    const [displayItems, setDisplayItems] = useState<InventoryObject[]>([]);
    const [borrowingItems, setBorrowingItems] = useState<string[]>([]);
    const [reservingItems, setReservingItems] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [dateDialogOpen, setDateDialogOpen] = useState(false);
    const [reserveDialogOpen, setReserveDialogOpen] = useState(false);
    const [borrowDays, setBorrowDays] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [inventoryData] = await Promise.all([
                    getReq('inventory/available')
                ]);
                setDisplayItems(inventoryData);
            } catch (error) {
                toast.error("Failed to fetch data");
            } finally {
                setLoading(false);
            }
        };
        fetchData().then(r => {});
    }, []);

    const handleBorrow = async () => {
        try {
            const expectReturnTime: string = borrowDays; // 直接使用 borrowDays
            await Promise.all(
                borrowingItems.map(id =>
                    postReq('inventory/borrow', {
                        data: {id, expectReturnTime}
                    })
                )
            );
            const [inventoryData] = await Promise.all([
                getReq('inventory/available')
            ]);
            setSelectedItems([]);
            setDisplayItems(inventoryData);
            toast.success(`${borrowingItems.length} item${(borrowingItems.length != 1 ? 's' : '')} borrowed successfully`);
        } catch (error) {
            toast.error("Failed to borrow items");
        }
    }

    const handleReserve = async () => {
        try {
            const expectReturnTime: string = borrowDays; // 直接使用 borrowDays
            await Promise.all(
                reservingItems.map(id =>
                    postReq('inventory/borrow', {
                        data: {id, expectReturnTime}
                    })
                )
            );
            const [inventoryData] = await Promise.all([
                getReq('inventory/available')
            ]);
            setSelectedItems([]);
            setDisplayItems(inventoryData);
            toast.success(`${reservingItems.length} item${(reservingItems.length != 1 ? 's' : '')} reserved successfully`);
        } catch (error) {
            toast.error("Failed to reserve items");
        }
    }

    const handleTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        const borrowDate = new Date(inputValue);
        const formattedDate = borrowDate.toISOString().slice(0, 19);
        setBorrowDays(formattedDate);
    };

    function CustomToolbar() {
        return (
            <GridToolbarContainer sx={{justifyContent: 'space-between'}}>
                <Box>
                    <GridToolbarExport/>
                </Box>
                <GridToolbarQuickFilter/>
            </GridToolbarContainer>
        );
    }

    function handleDialogOpen() {
        const allBorrowedByOthers = selectedItems.every(id => {
            const item = displayItems.find(item => item.id === id);
            return item?.borrowed;
        });

        const noneBorrowedByOthers = selectedItems.every(id => {
            const item = displayItems.find(item => item.id === id);
            return !item?.borrowed;
        });

        console.log(allBorrowedByOthers);
        console.log(noneBorrowedByOthers);

        let itemsToBeReserved: string[] = [];
        let itemsToBeBorrowed: string[] = [];

        for (let i:number = 0; i < selectedItems.length; i++) {
            const item = displayItems.find(item => item.id === selectedItems[i]);
            if (item?.borrowed == true) {
                itemsToBeReserved.push(item.id)
            } else if (item?.borrowed == false) {
                itemsToBeBorrowed.push(item.id);
            }
        }

        setReservingItems(itemsToBeReserved);
        setBorrowingItems(itemsToBeBorrowed);

        console.log(itemsToBeReserved.length);

        if (noneBorrowedByOthers) {
            setDateDialogOpen(true);
        } else {
            setReserveDialogOpen(true);
        }
    }

    function handleDialogClose() {
        setDateDialogOpen(false);
    }

    function handleReserveDialogClose() {
        setReserveDialogOpen(false);

        const allBorrowedByOthers = selectedItems.every(id => {
            const item = displayItems.find(item => item.id === id);
            return item?.borrowed;
        });

        if (!allBorrowedByOthers) {
            setDateDialogOpen(true);
        }
    }

    return (
        <React.Fragment>
            <Box sx={{
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                top: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                p: 3
            }}>
                <DataGrid
                    loading={loading}
                    columns={cols}
                    rows={displayItems}
                    pageSizeOptions={[10, 25, 50, 100]}
                    initialState={{pagination: {paginationModel}}}
                    checkboxSelection={true}
                    hideFooterSelectedRowCount={false}
                    onRowSelectionModelChange={(newSelection) => {
                        setSelectedItems(newSelection as string[]);
                    }}
                    sx={{
                        width: '100%', height: '100%',
                        '& .MuiDataGrid-main': {
                            maxHeight: 'calc(100vh - 250px)',
                            overflowY: 'auto'
                        }
                    }}
                    slots={{
                        toolbar: CustomToolbar
                    }}
                />
                <Box sx={{width: '100%', display: "flex", justifyContent: 'flex-end', alignItems: 'right'}}>
                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="contained"
                            onClick={() => handleDialogOpen()}
                            disabled={selectedItems.length === 0}
                        >
                            Borrow selected
                        </Button>
                    </Stack>
                </Box>
            </Box>
            <Dialog
                open={dateDialogOpen}
                onClose={handleDialogClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        handleBorrow().then(r => handleDialogClose());
                    },
                }}
            >
                <DialogTitle>Borrow</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        For the items you borrow, which day are you going to return them?
                    </DialogContentText>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id={"numberOfDays"}
                        name=""
                        label=""
                        type="date"
                        fullWidth
                        variant="standard"
                        onChange={handleTextFieldChange}
                        slotProps={{
                            htmlInput: {
                                min: new Date().toISOString().split("T")[0],
                                max: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split("T")[0]
                            }
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Cancel</Button>
                    <Button
                        type="submit"
                    >
                        Borrow
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={reserveDialogOpen}
                onClose={handleReserveDialogClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        handleReserve().then(r => handleReserveDialogClose());
                    },
                }}
            >
                <DialogTitle>Reserve</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Some items you selected are borrowed by others. Do you want to reserve them?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleReserveDialogClose}>Cancel</Button>
                    <Button
                        type="submit"
                    >
                        Reserve
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}