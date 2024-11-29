import {Box} from "@mui/material";
import {DataGrid, GridActionsCellItem, GridColDef, useGridApiRef} from "@mui/x-data-grid";
import {useEffect, useState} from "react";
import {UserObject, UserRole} from "../../../common/User";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PasswordIcon from '@mui/icons-material/Password';
import {AutoCompleteEditCellBuilder} from "@/app/admin/AutoCompleteEditCell";
import {deleteReq, getReq, postReq} from "@/app/net";
import {toast} from "react-toastify";
import {useResetPasswordModal} from "@/app/admin/ResetPasswordModal";

export default function UserTab() {
    const [users, setUsers] = useState<UserObject[]>([]);
    const [loading, setLoading] = useState(false);
    const [setOpen, setResetUser, ResetPasswordModal] = useResetPasswordModal();
    const apiRef = useGridApiRef();

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
                        icon={<PasswordIcon/>}
                        label="Reset Password"
                        onClick={() => handleResetPassword(row)}
                        color="inherit"
                    />,
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

    function handleResetPassword(row: UserObject) {
        setResetUser(row);
        setOpen(true);
    }

    function handleDeleteClick(row: UserObject) {
        const sure = confirm(`Make sure you want to delete user ${row.username}`);
        if (sure) {
            deleteReq(`/user/delete/${row.id}`).then((res) => {
                if (res) {
                    setUsers(users.filter(user => user.id !== row.id));
                    toast.success("Delete successfully");
                }
            });
        }
    }

    function handleSaveRow(id: string, field: string) {
        const user = apiRef.current.getRowWithUpdatedValues(id, field);
        postReq('/user/update', {
            data: user
        }).then(() => {
            toast.success("Save successfully");
        });
    }

    useEffect(() => {
        setLoading(true);
        getReq('/user').then((res) => {
            if (res) {
                setUsers(res);
                setLoading(false);
            }
        });
    }, []);

    return (
        <Box sx={{
            width: '100%', height: '100%',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}>
            <DataGrid
                apiRef={apiRef}
                rows={users}
                columns={columns}
                loading={loading}
                editMode="row"
                disableRowSelectionOnClick
                pageSizeOptions={[10, 50, 100]}
                initialState={{ pagination: { paginationModel } }}
                onRowEditStop={(params) => {
                    handleSaveRow(params.id.toString(), params.field || "");
                }}
                sx={{width: '100%'}}
            />
            {ResetPasswordModal}
        </Box>
    );
}
