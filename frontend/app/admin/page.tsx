"use client"

import {Box, Tab, Tabs} from "@mui/material";
import {ReactNode, useState} from "react";
import BookTab from "@/app/admin/BookTab";
import UserTab from "@/app/admin/UserTab";

type tabObject = {
    label: string;
    element: ReactNode,
}

const tabs: tabObject[] = [
    {
        label: "Books",
        element: <BookTab/>
    },
    {
        label: "Users",
        element: <UserTab/>
    }
];

function a11yProps(index: number) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

export default function Page() {
    const [tabIndex, setTabIndex] = useState(0);

    return (
        <Box sx={{
            flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: '100%',
            flexDirection: 'row', justifyContent: 'space-between', width: '100%',
            alignItems: 'flex-start'
        }}>
            <Tabs
                orientation="vertical"
                variant="standard"
                value={tabIndex}
                sx={{ borderRight: 1, borderColor: 'divider' }}
            >
                {
                    tabs.map((tab, index) => (
                        <Tab
                            label={tab.label}
                            key={index}
                            onClick={() => setTabIndex(index)}
                            {...a11yProps(index)}
                        />
                    ))
                }
            </Tabs>
            {
                tabs.map((tab, index) => (
                    index !== tabIndex ? <></> : (
                        <Box sx={{height: '100%', width: '100%', p: 3}}>
                            { tab.element }
                        </Box>
                    )
                ))
            }
        </Box>
    );
}
