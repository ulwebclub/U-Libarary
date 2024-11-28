import {Box, Button, Modal, Stack, TextField, Typography} from "@mui/material";
import {ReactNode, useState} from "react";
import {postReq} from "@/app/net";
import {toast} from "react-toastify";
import {sha256} from "js-sha256";

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

export function useRegisterModal() : [
    (open: boolean) => void,
    ReactNode
] {
    const [open, setOpen] = useState(false);

    function RegisterModal() {
        const [username, setUsername] = useState("");
        const [password, setPassword] = useState("");
        const [email, setEmail] = useState("");

        function handleRegister() {
            if (!username) {
                toast.error("Username is required");
                return;
            }
            if (!email) {
                toast.error("Email is required");
                return;
            }
            if (!password) {
                toast.error("Password is required");
                return;
            }

            postReq('/user/add', {
                email: email,
                username: username,
                password: sha256(password)
            }).then(() => {
                setOpen(false);
                toast.success("Register successfully");
            });
        }

        return (
            <Modal open={open} onClose={() => setOpen(false)}>
                <Box sx={style}>
                    <Typography variant="h6" component="h2">
                        Register U-Library
                    </Typography>
                    <Stack gap={2} sx={{width: '100%'}}>
                        <TextField
                            label="Username"
                            variant="outlined"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <TextField
                            label="Email"
                            variant="outlined"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
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
                        Register Now
                    </Button>
                </Box>
            </Modal>
        );
    }

    return [
        setOpen,
        <RegisterModal/>
    ];
}
