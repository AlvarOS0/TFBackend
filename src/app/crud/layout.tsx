import React from 'react';
import { AppBar, Toolbar, Typography, Container, Button } from '@mui/material';
import Link from 'next/link';
import LoginIcon from '@mui/icons-material/Login';

export default function PublicLayout({
                                         children,
                                     }: {
    children: React.ReactNode
}) {
    return (
        <>
            <AppBar position="sticky">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Lista de Productos
                    </Typography>
                    <Link href="/login" passHref legacyBehavior>
                        <Button
                            color="secondary"
                            variant="contained"
                            startIcon={<LoginIcon />}
                            sx={{
                                fontWeight: 'bold',
                                textTransform: 'none',
                                borderRadius: '20px',
                                px: 2
                            }}
                        >
                            Iniciar Sesión
                        </Button>
                    </Link>
                </Toolbar>
            </AppBar>
            <Container sx={{ mt: 4 }}>
                {children}
            </Container>
        </>
    )
}
