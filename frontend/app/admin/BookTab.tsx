import {Box, Button} from "@mui/material";
import {DataGrid, GridActionsCellItem, GridColDef, GridRowId, useGridApiRef} from "@mui/x-data-grid";
import {useEffect, useState} from "react";
import {EMPTY_INVENTORY, InventoryObject, InventoryType} from "../../../common/Inventory";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {AutoCompleteEditCellBuilder} from "@/app/admin/AutoCompleteEditCell";
import {deleteReq, getReq, postReq} from "@/app/net";
import AddIcon from '@mui/icons-material/Add';
import {toast} from "react-toastify";

export default function BookTab() {
    const [items, setItems] = useState<InventoryObject[]>([]);
    const [loading, setLoading] = useState(false);
    const apiRef = useGridApiRef();

    const paginationModel = { page: 0, pageSize: 10 };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID' },
        {
            field: 'type',
            headerName: 'Type',
            editable: true,
            renderEditCell: AutoCompleteEditCellBuilder(Object.values(InventoryType))
        },
        { field: 'isbn', headerName: 'ISBN', editable: true, minWidth: 150 },
        { field: 'author', headerName: 'Author', editable: true },
        { field: 'title', headerName: 'Title', editable: true, flex: 1 },
        { field: 'borrowedBy', headerName: 'Borrowed By', minWidth: 150 },
        { field: 'reservedBy', headerName: 'Reserved By', minWidth: 150 },
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
        if (row.id.length === 0) {
            setItems(items.filter(items => items.id !== row.id));
            return;
        }

        const sure = confirm(`Make sure you want to delete this inventory ${row.id}`);
        if (sure) {
            deleteReq(`/inventory/delete/${row.id}`).then(() => {
                setItems(items.filter(items => items.id !== row.id));
                toast.success("Delete successfully");
            });
        }
    }

    function handleNewItem() {
        setItems((oldItems) => [
            EMPTY_INVENTORY,
            ...oldItems
        ]);
    }

    function handleSaveRow(id: GridRowId, field: string) {
        const row = apiRef.current.getRowWithUpdatedValues(id, field);
        if (row.id.length === 0) {
            postReq('/inventory/add', {
                data: {
                    isbn: row.isbn,
                    author: row.author,
                    title: row.title,
                    type: row.type
                }
            }).then((res) => {
                if (res) {
                    setItems((oldItems) => {
                        let newItems = oldItems.filter(item => item.id !== row.id);
                        newItems.push(res);
                        return newItems;
                    });
                    toast.success("Save successfully");
                }
            });
        } else {
            postReq('/inventory/update', {
                data: row
            }).then(() => {
                toast.success("Save successfully");
            });
        }
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
            width: '100%', height: '100%',
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
                apiRef={apiRef}
                rows={items}
                columns={columns}
                loading={loading}
                editMode="row"
                disableRowSelectionOnClick
                pageSizeOptions={[10, 50, 100]}
                initialState={{ pagination: { paginationModel } }}
                onRowEditStop={(params) => {
                    handleSaveRow(params.id, params.field || "");
                }}
                sx={{width: '100%', flexGrow: 1}}
            />
        </Box>
    );
}
