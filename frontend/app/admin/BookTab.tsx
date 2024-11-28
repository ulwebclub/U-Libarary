import {Box, Button, ButtonGroup} from "@mui/material";
import {DataGrid, GridActionsCellItem, GridColDef} from "@mui/x-data-grid";
import {useEffect, useState} from "react";
import {EMPTY_INVENTORY, InventoryObject, InventoryType} from "../../../common/Inventory";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {AutoCompleteEditCellBuilder} from "@/app/admin/AutoCompleteEditCell";
import {getReq} from "@/app/net";
import AddIcon from '@mui/icons-material/Add';

export default function BookTab() {
    const [items, setItems] = useState<InventoryObject[]>([]);
    const [loading, setLoading] = useState(false);

    const paginationModel = { page: 0, pageSize: 10 };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID' },
        {
            field: 'type',
            headerName: 'Type',
            editable: true,
            renderEditCell: AutoCompleteEditCellBuilder(Object.values(InventoryType))
        },
        { field: 'isbn', headerName: 'ISBN', editable: true },
        { field: 'author', headerName: 'Author', editable: true },
        { field: 'title', headerName: 'Title', editable: true, flex: 1 },
        { field: 'borrowedBy', headerName: 'Borrowed By'},
        { field: 'reservedBy', headerName: 'Reserved By'},
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            getActions: ({row}) => {
                return [
                    <GridActionsCellItem
                        icon={<DeleteOutlineIcon/>}
                        label="Delete"
                        onClick={() => handleDeleteClick(row)}
                        color="inherit"
                    />
                ];
            }
        }
    ];

    function handleDeleteClick(row: InventoryObject) {
        const sure = confirm(`Make sure you want to delete this inventory`);
        if (sure) {
            setItems(items.filter(items => items.id !== row.id));
        }
    }

    function handleNewItem() {
        setItems((oldItems) => [
            EMPTY_INVENTORY,
            ...oldItems
        ]);
    }

    function handleSaveRow(row: InventoryObject) {

    }

    useEffect(() => {
        setLoading(true);
        getReq('/inventory/all').then((res) => {
            if (res) {
                setItems(res);
                setLoading(false);
            }
        });
    }, []);

    return (
        <Box sx={{
            width: '80%', height: '100%',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}>
            <Box sx={{
                width: '100%', gap: 1,
                display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center',
            }}>
                <Button
                    startIcon={<AddIcon/>}
                    onClick={() => handleNewItem()}
                >
                    New Inventory
                </Button>
            </Box>
            <DataGrid
                rows={items}
                columns={columns}
                loading={loading}
                editMode="row"
                disableRowSelectionOnClick
                pageSizeOptions={[10, 50, 100]}
                initialState={{ pagination: { paginationModel } }}
                onRowEditStop={(params) => {
                    handleSaveRow(params.row);
                }}
                sx={{width: '100%', minWidth: 400, flexGrow: 1}}
            />
        </Box>
    );
}
