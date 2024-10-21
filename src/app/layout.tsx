'use client'
import React from 'react';
import {ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {AppRouterCacheProvider} from '@mui/material-nextjs/v14-appRouter';
import theme from "../app/theme";
import {AuthProvider} from "@/app/context/AuthContext";
import ReactQueryProvider from "@/app/providers/ReactQueryProvider";

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body>
        <ReactQueryProvider>
            <AppRouterCacheProvider>
                <ThemeProvider theme={theme}>
                    <AuthProvider>
                        <CssBaseline/>
                        {children}
                    </AuthProvider>
                </ThemeProvider>
            </AppRouterCacheProvider>
        </ReactQueryProvider>
        </body>
        </html>
    )
}