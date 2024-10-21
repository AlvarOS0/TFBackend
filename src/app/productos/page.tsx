import React from 'react';
import {
    Container,
    Typography,
    Card,
    CardContent,
    Button
} from '@mui/material';
import Link from 'next/link';
import Grid from '@mui/material/Grid2';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
}

const API_URL = 'http://localhost:3000/api/products'; 

async function getProducts(): Promise<Product[]> {
    const res = await fetch(API_URL);
    if (!res.ok) {
        throw new Error('Failed to fetch products');
    }
    return res.json();
}

export default async function ProductsPage() {
    const products = await getProducts();

    return (
        <Container maxWidth="lg" sx={{mt: 4, mb: 4}}>
            <Typography variant="h2" component="h1" gutterBottom>
                Nuestros Productos
            </Typography>
            <Grid container spacing={4}>
                {products.map((product) => (
                    <Grid
                        size={{xs: 12, sm: 6, md: 4}}
                        key={product.id}>
                        <Card>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {product.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {product.description.substring(0, 100)}...
                                </Typography>
                                <Typography variant="h6" color="text.primary">
                                    ${product.price.toFixed(2)}
                                </Typography>
                                <Link href={`/productos/${product.id}`} passHref legacyBehavior>
                                    <Button variant="contained" color="primary" sx={{mt: 2}}>
                                        Ver Producto
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}
