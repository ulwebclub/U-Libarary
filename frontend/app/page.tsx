'use client'

import {Box, Button, Card, CardActions, CardContent, CardMedia, TextField, Typography} from "@mui/material";
import {useState} from "react";
import {toast} from "react-toastify";

export default function Home() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    function handleLogin() {
        if (!username) {
            toast.error("Username is required");
            return;
        }
        if (!password) {
            toast.error("Password is required");
            return;
        }
        // login
    }

    return (
        <Card sx={{width: '50%', minWidth: 400}}>
            <CardMedia
                component="img"
                alt="Home page"
                sx={{height: '40%'}}
                image="/login.png"
            />
            <Box sx={{p: 3}}>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        U-Library
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        An example library system designed for a middle school.
                    </Typography>
                </CardContent>
                <CardActions>
                    <Box sx={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        width: '100%', gap: 2, height: '100%'
                    }} component="form">
                        <TextField
                            label="Username / Email"
                            variant="outlined"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            sx={{width: '100%'}}
                        />
                        <TextField
                            label="Password"
                            variant="outlined"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            sx={{width: '100%'}}
                        />
                        <Box sx={{
                            display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                            width: '100%', pt: 1
                        }}>
                            <Button>
                                Register
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => handleLogin()}
                            >
                                Login
                            </Button>
                        </Box>
                    </Box>
                </CardActions>
            </Box>
        </Card>
    );
}
