import {Box} from "@mui/material";
import {DataGrid, GridActionsCellItem, GridColDef} from "@mui/x-data-grid";
import {useState} from "react";
import {InventoryObject, InventoryType} from "../../../common/Inventory";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {AutoCompleteEditCellBuilder} from "@/app/admin/AutoCompleteEditCell";

export default function BookTab() {
    const [items, setItems] = useState<InventoryObject[]>([]);

    const paginationModel = { page: 0, pageSize: 10 };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID' },
        {
            field: 'type',
            headerName: 'Type',
            editable: true,
            renderEditCell: AutoCompleteEditCellBuilder(Object.values(InventoryType))
        },
        { field: 'author', headerName: 'Author', editable: true },
        { field: 'title', headerName: 'Title', editable: true, flex: 1 },
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
        const sure = confirm(`Make sure you want to delete inventory ${row.title}`);
        if (sure) {
            setItems(items.filter(items => items.id !== row.id));
        }
    }

    return (
        <Box sx={{
            width: '100%', height: '100%',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}>
            <DataGrid
                rows={items}
                columns={columns}
                editMode="row"
                disableRowSelectionOnClick
                pageSizeOptions={[10, 50, 100]}
                initialState={{ pagination: { paginationModel } }}
                sx={{width: '80%', minWidth: 400}}
            />
        </Box>
    );
}
