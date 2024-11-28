"use client"

import {Box, ButtonGroup, IconButton, Tab, Tabs} from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import ReplayIcon from '@mui/icons-material/Replay';

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
    },
    {
        label: "Admin",
        route: '/admin'
    }
];

function a11yProps(index: number) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

export default function MainTabs() {
    return (
        <Box sx={{
            bgcolor: 'background.paper', display: 'flex',
            flexDirection: 'row', justifyContent: 'space-between', width: '100%',
            alignItems: 'center'
        }}>
            <Tabs
                variant="standard"
                value={window.location.pathname}
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
            </Tabs>
            <ButtonGroup sx={{cursor: 'pointer', pointerEvents: 'auto'}} variant="outlined">
                <IconButton onClick={() => window.location.reload()}>
                    <ReplayIcon/>
                </IconButton>
                <IconButton onClick={() => {
                    document.cookie = "permission=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    window.location.href = '/';
                }}>
                    <LogoutIcon/>
                </IconButton>
            </ButtonGroup>
        </Box>
    );
}
