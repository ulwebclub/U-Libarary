import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import {Roboto} from "next/font/google";
import {ReactNode} from "react";
import {Box, Stack} from "@mui/material";
import {Slide, ToastContainer} from "react-toastify";
// required by react-toastify
import 'react-toastify/dist/ReactToastify.css';
import MainTabs from "@/app/MainTabs";

const roboto = Roboto({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-roboto',
});

export default function RootLayout(props: {children: ReactNode}) {
    const { children } = props;
    return (
        <html>
        <body className={roboto.variable}>
        <AppRouterCacheProvider options={{enableCssLayer: true}}>
            <ThemeProvider theme={theme}>
                <ToastContainer
                    position="top-right"
                    autoClose={2500}
                    closeOnClick
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    transition={Slide}
                />
                <Stack sx={{
                    position: 'absolute', top: 0, left: 0, m: 0, p: 0,
                    width: '100vw', height: '100vh', overflow: 'hidden',
                    alignItems: 'center'
                }}>
                    <MainTabs/>
                    <Box sx={{
                        flexGrow: 1, width: '80%', height: '100%', pb: 3, minWidth: 400,
                        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
                    }}>
                        {children}
                    </Box>
                </Stack>
            </ThemeProvider>
        </AppRouterCacheProvider>
        </body>
        </html>
    );
}
