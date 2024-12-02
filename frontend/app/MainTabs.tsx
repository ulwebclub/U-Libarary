"use client"

import {Box, ButtonGroup, IconButton, Tab, Tabs} from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import ReplayIcon from '@mui/icons-material/Replay';
import {useEffect, useState} from "react";
import {getReq} from "@/app/net";
import {toast} from "react-toastify";
import {UserObject, UserRole} from "../../common/User";

type tabObject = {
    label: string,
    route: string,
}

const tabs: tabObject[] = [
    {
        label: "Borrow",
        route: "/borrow"
    },
    {
        label: "Return",
        route: '/return'
    }
];

function a11yProps(index: number) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

export default function MainTabs() {
    const [showAdmin, setShowAdmin] = useState(false);

    useEffect(() => {
        getReq('/user/whoami').then((res: UserObject) => {
            if (res) {
                if (res.role === UserRole.Admin) {
                    setShowAdmin(true);
                } else {
                    if (window.location.pathname === '/admin') {
                        handleLogout();
                    }
                }

                if (window.location.pathname === '/') {
                    if (res.role === UserRole.User) {
                        window.location.href = '/borrow';
                    } else {
                        window.location.href = '/admin';
                    }
                }
            } else {
                if (window.location.pathname !== '/') {
                    handleLogout();
                }
            }
        });
    }, []);

    function handleLogout() {
        getReq('/auth/logout').then(() => {
            toast.success("Logout successfully");
            window.location.href = '/';
        });
    }

    return (
        <Box sx={{
            bgcolor: 'background.paper', display: 'flex',
            flexDirection: 'row', justifyContent: 'space-between', width: '100%',
            alignItems: 'center'
        }}>
            <Tabs
                variant="standard"
                value={typeof window !== 'undefined' ? window.location.pathname : ''}
                sx={{flexGrow: 1}}
            >
                {
                    tabs.map((tab, index) => (
                        <Tab
                            label={tab.label}
                            key={index}
                            onClick={() => window.location.href = tab.route}
                            {...a11yProps(index)}
                            value={tab.route}
                        />
                    ))
                }
                {
                    showAdmin ? (
                        <Tab
                            label="Admin"
                            onClick={() => window.location.href = "/admin"}
                            {...a11yProps(-1)}
                            value="/admin"
                        />
                    ) : <></>
                }
            </Tabs>
            <ButtonGroup sx={{cursor: 'pointer', pointerEvents: 'auto'}} variant="outlined">
                <IconButton onClick={() => window.location.reload()}>
                    <ReplayIcon/>
                </IconButton>
                <IconButton onClick={() => handleLogout()}>
                    <LogoutIcon/>
                </IconButton>
            </ButtonGroup>
        </Box>
    );
}
