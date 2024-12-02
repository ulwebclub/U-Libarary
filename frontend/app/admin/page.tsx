"use client"

import {Box, Tab, Tabs} from "@mui/material";
import {ReactNode, useEffect, useState} from "react";
import BookTab from "@/app/admin/BookTab";
import UserTab from "@/app/admin/UserTab";

type tabObject = {
    label: string,
    element: ReactNode,
}

const tabs: tabObject[] = [
    {
        label: "Books & CDs",
        element: <BookTab/>
    },
    {
        label: "Users",
        element: <UserTab/>
    }
];

const TAB_KEY = "tab";

function a11yProps(index: number) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

export default function Page() {
    const [tabIndex, setTabIndex] = useState(0);

    function TabContent() {
        return tabs[tabIndex].element;
    }

    function handleSetIndex(index: number) {
        const url = new URL(window.location.href);
        url.search = `${TAB_KEY}=${index}`;
        history.pushState({}, "", url);  // prevent refresh
        setTabIndex(index);
    }

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const recordIndex = parseInt(params.get(TAB_KEY) || "0");
        setTabIndex(recordIndex);
    }, []);

    return (
        <Box sx={{
            flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: '100%',
            flexDirection: 'column', justifyContent: 'space-between', width: '100%',
            alignItems: 'center'
        }}>
            <Tabs
                variant="standard"
                value={tabIndex}
            >
                {
                    tabs.map((tab, index) => (
                        <Tab
                            label={tab.label}
                            key={index}
                            onClick={() => handleSetIndex(index)}
                            {...a11yProps(index)}
                        />
                    ))
                }
            </Tabs>
            <TabContent/>
        </Box>
    );
}
