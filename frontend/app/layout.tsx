import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import {Roboto} from "next/font/google";
import {ReactNode} from "react";
import {Box, Container} from "@mui/material";
import {Slide, ToastContainer} from "react-toastify";
// required by react-toastify
import 'react-toastify/dist/ReactToastify.css';

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
                    autoClose={5000}
                    closeOnClick
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    transition={Slide}
                />
                <Box sx={{
                    width: '100%', height: '100vh', overflow: 'auto',
                    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
                }}>
                    {children}
                </Box>
            </ThemeProvider>
        </AppRouterCacheProvider>
        </body>
        </html>
    );
}
