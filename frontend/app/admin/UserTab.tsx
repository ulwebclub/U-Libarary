import {Box} from "@mui/material";
import {DataGrid, GridActionsCellItem, GridColDef} from "@mui/x-data-grid";
import {useEffect, useState} from "react";
import {UserObejct, UserRole} from "../../../common/user";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {AutoCompleteEditCellBuilder} from "@/app/admin/AutoCompleteEditCell";

export default function UserTab() {
    const [users, setUsers] = useState<UserObejct[]>([]);

    const paginationModel = { page: 0, pageSize: 10 };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID' },
        {
            field: 'role',
            headerName: 'Role',
            editable: true,
            renderEditCell: AutoCompleteEditCellBuilder(Object.values(UserRole))
        },
        { field: 'username', headerName: 'Username', editable: true, flex: 1 },
        { field: 'email', headerName: 'Email', editable: true, flex: 1 },
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

    function handleDeleteClick(row: UserObejct) {
        const sure = confirm(`Make sure you want to delete user ${row.username}`);
        if (sure) {
            setUsers(users.filter(user => user.id !== row.id));
        }
    }

    return (
        <Box sx={{
            width: '100%', height: '100%',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}>
            <DataGrid
                rows={users}
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
