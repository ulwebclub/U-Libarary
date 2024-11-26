import {Autocomplete, Box, IconButton, Paper, TextField, Toolbar, Tooltip, Typography} from "@mui/material";
import {DataGrid, GridColDef, GridRenderEditCellParams, useGridApiContext} from "@mui/x-data-grid";
import {useEffect, useState} from "react";
import {User, UserRole} from "../../../common/user";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';

const paginationModel = { page: 0, pageSize: 10 };

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID' },
    { field: 'username', headerName: 'Username', width: 200, editable: true },
    {
        field: 'role',
        headerName: 'Role',
        editable: true,
        width: 150,
        renderEditCell: RoleEditCell
    },
    { field: 'email', headerName: 'Email', width: 500, editable: true },
    {
        field: 'password',
        headerName: 'Password',
        width: 500,
        valueGetter: _value => '********'
    },
];

function RoleEditCell(props: GridRenderEditCellParams<any, UserRole>) {
    const { id, field, api } = props;

    function handleChange(newValue: UserRole | null) {
        if (newValue) {
            api.setEditCellValue({
                id, field, value: newValue
            });
        }
    }

    return (
        <Box sx={{width: '100%', translate: '0 -20px'}}>
            <Autocomplete
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="outlined"
                        placeholder="Role"
                        margin="normal"
                        fullWidth
                    />
                )}
                onChange={(_e, v) => {
                    handleChange(v);
                }}
                options={Object.values(UserRole)}
            />
        </Box>
    );
}

interface EnhancedTableToolbarProps {
    users: User[];
    selectedIDs: string[];
    setUsers: (users: User[]) => void;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
    const { users, selectedIDs, setUsers } = props;

    const numSelected = selectedIDs.length;

    function handleDelete() {
        const newUsers: User[] = [];
        users.forEach((user) => {
            if (!selectedIDs.includes(user.id)) {
                newUsers.push(user);
            }
        });
        setUsers(newUsers);
    }

    function handleSave() {

    }

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                width: '90%'
            }}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    Users
                </Typography>
            )}
            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton onClick={() => handleDelete()}>
                        <DeleteOutlineIcon />
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Save">
                    <IconButton onClick={() => handleSave()}>
                        <SaveOutlinedIcon />
                    </IconButton>
                </Tooltip>
            )}
        </Toolbar>
    );
}

export default function UserTab() {
    const [users, _setUsers] = useState<User[]>([]);
    const [selectedIDs, setSelectedIDs] = useState<string[]>([]);

    useEffect(() => {
        _setUsers([
            {id: "1", username: "Iewnfod", email: "ziqian.wu@ulink.cn", password: "lucaissb", role: UserRole.Admin},
            {id: "2", username: "Luca", email: "zekai.lu@ulink.cn", password: "lucaissb", role: UserRole.User},
            {id: "3", username: "Soap", email: "ze.lan@ulink.cn", password: "lucaissb", role: UserRole.User},
        ]);
    }, []);

    function setUsers(newUsers: User[]) {
        _setUsers(newUsers);
    }

    return (
        <Box sx={{width: '100%', overflow: 'hidden'}}>
            <Paper sx={{p: 3, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                <EnhancedTableToolbar
                    users={users}
                    selectedIDs={selectedIDs}
                    setUsers={setUsers}
                />
                <DataGrid
                    rows={users}
                    columns={columns}
                    checkboxSelection
                    disableRowSelectionOnClick
                    pageSizeOptions={[10, 50, 100]}
                    initialState={{ pagination: { paginationModel } }}
                    sx={{width: '90%'}}
                />
            </Paper>
        </Box>
    );
}
