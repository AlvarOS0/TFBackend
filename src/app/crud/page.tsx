'use client';

import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import {
    Button,
    Container,
    Typography,
    Box,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
} from '@mui/material';
import { useAuth } from '../context/AuthContext'; 
import Cookies from 'js-cookie';

interface Product {
    id?: number;
    name: string;
    price: number;
    description: string;
}


export default function DataGridActionsPage() {
    const { user } = useAuth(); 
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
    
    const accessToken = Cookies.get('token'); 

    
    const fetchProducts = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/products', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (res.status === 401) {
                throw new Error('No autorizado. Verifica tus credenciales.');
            }

            if (!res.ok) {
                throw new Error('Error al cargar los productos');
            }

            const data = await res.json();
            const productsWithId = data.map((product: Product, index: number) => ({
                ...product,
                id: product.id || index,
            }));
            setProducts(productsWithId);
        } catch (error) {
            setError((error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    
    const handleDelete = async (id: number) => {
        try {
            await fetch(`http://localhost:3000/api/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            setProducts(products.filter((product) => product.id !== id));
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
        }
    };

    
    const handleOpenDialog = (product: Product | null = null) => {
        setCurrentProduct(product);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentProduct(null);
    };

    const handleSubmit = async () => {
        if (!currentProduct) return;

        const method = currentProduct.id ? 'PATCH' : 'POST';
        const url = currentProduct.id
            ? `http://localhost:3000/api/products/${currentProduct.id}`
            : 'http://localhost:3000/api/products';

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(currentProduct),
            });

            const updatedProduct = await res.json();

            if (method === 'POST') {
                setProducts([...products, updatedProduct]);
            } else {
                setProducts(
                    products.map((product) =>
                        product.id === updatedProduct.id ? updatedProduct : product
                    )
                );
            }

            handleCloseDialog();
        } catch (error) {
            console.error('Error al guardar el producto:', error);
        }
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ textAlign: 'center', mt: 4 }}>
                <CircularProgress />
                <Typography variant="h6" component="p" gutterBottom>
                    Cargando productos...
                </Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ textAlign: 'center', mt: 4 }}>
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
            </Container>
        );
    }


    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Nombre', width: 200 },
        { field: 'price', headerName: 'Precio', width: 120, type: 'number' },
        { field: 'description', headerName: 'Descripción', width: 300 },
        {
            field: 'actions',
            headerName: 'Acciones',
            width: 200,
            renderCell: (params: GridRenderCellParams) => (
                <>
                    <Button
                        onClick={() => handleOpenDialog(params.row)}
                        variant="contained"
                        color="primary"
                        size="small"
                        style={{ marginRight: 8 }}
                    >
                        Editar
                    </Button>
                    <Button
                        onClick={() => handleDelete(params.row.id!)}
                        variant="contained"
                        color="secondary"
                        size="small"
                    >
                        Eliminar
                    </Button>
                </>
            ),
        },
    ];

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Lista de Productos
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenDialog(null)}
                    sx={{ mb: 2 }}
                >
                    Añadir Producto
                </Button>
                <Box sx={{ width: '100%' }}>
                    <DataGrid
                        rows={products}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { pageSize: 5, page: 0 },
                            },
                        }}
                        pageSizeOptions={[5, 10]}
                        disableRowSelectionOnClick
                    />
                </Box>
            </Box>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>
                    {currentProduct?.id ? 'Editar Producto' : 'Añadir Producto'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Nombre"
                        fullWidth
                        value={currentProduct?.name || ''}
                        onChange={(e) =>
                            setCurrentProduct({
                                ...currentProduct,
                                name: e.target.value,
                            } as Product)
                        }
                    />
                    <TextField
                        margin="dense"
                        label="Precio"
                        fullWidth
                        type="number"
                        value={currentProduct?.price || 0}
                        onChange={(e) =>
                            setCurrentProduct({
                                ...currentProduct,
                                price: parseFloat(e.target.value),
                            } as Product)
                        }
                    />
                    <TextField
                        margin="dense"
                        label="Descripción"
                        fullWidth
                        value={currentProduct?.description || ''}
                        onChange={(e) =>
                            setCurrentProduct({
                                ...currentProduct,
                                description: e.target.value,
                            } as Product)
                        }
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        {currentProduct?.id ? 'Guardar Cambios' : 'Añadir Producto'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
