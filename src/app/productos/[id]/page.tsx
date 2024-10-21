
import { Typography, Container, Paper, Button } from '@mui/material';
import Link from 'next/link'; 
import LoginIcon from '@mui/icons-material/Login'; 
import { ArrowBack } from '@mui/icons-material';
interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
   
}

async function getProduct(id: string): Promise<Product> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`);
    if (!res.ok) {
        throw new Error('Failed to fetch product');
    }
    return res.json();
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
    const product = await getProduct(params.id);

    return (
        <Container maxWidth="md">
            <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {product.name}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    Precio: ${product.price.toFixed(2)}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    {product.description}
                </Typography>
               
            </Paper>
            <Link href="/productos" passHref legacyBehavior>
                <Button
                    color="primary"
                    variant="contained"
                    startIcon={<ArrowBack />}
                    sx={{
                        fontWeight: 'bold',
                        textTransform: 'none',
                        borderRadius: '20px',
                        px: 2,
                        mt: 2 
                    }}
                >
                    Atras
                </Button>
            </Link>
        </Container>
    );
}
