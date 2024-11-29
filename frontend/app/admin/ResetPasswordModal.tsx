import {ReactNode, useState} from "react";
import {toast} from "react-toastify";
import {postReq} from "@/app/net";
import {sha256} from "js-sha256";
import {Box, Button, Modal, Stack, TextField, Typography} from "@mui/material";
import {EMPTY_USER, UserObject} from "../../../common/User";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 1,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3
};

export function useResetPasswordModal() : [
    (open: boolean) => void,
    (user: UserObject) => void,
    ReactNode
] {
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState<UserObject>(EMPTY_USER);

    function ResetPasswordModal() {
        const [password, setPassword] = useState("");

        function handleRegister() {
            if (!password) {
                toast.error("Password is required");
                return;
            }

            user.password = sha256(password);

            postReq('/user/update', {
                data: user
            }).then(() => {
                setOpen(false);
                toast.success("Reset successfully");
            });
        }

        return (
            <Modal open={open} onClose={() => setOpen(false)}>
                <Box sx={style}>
                    <Typography variant="h6" component="h2">
                        Reset password for {user.username}
                    </Typography>
                    <Stack gap={2} sx={{width: '100%'}}>
                        <TextField
                            label="Password"
                            variant="outlined"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Stack>
                    <Button
                        variant="outlined"
                        onClick={() => handleRegister()}
                    >
                        Reset Now
                    </Button>
                </Box>
            </Modal>
        );
    }

    return [
        setOpen,
        setUser,
        <ResetPasswordModal/>
    ];
}
