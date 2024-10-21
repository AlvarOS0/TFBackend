import axios from 'axios';

interface LoginResponse {
    access_token: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL; 

export const login = async (email: string, password: string) => {
    try {
        const response = await axios.post<LoginResponse>(`${API_URL}/auth/login`, {
            email,
            password
        });
        return response.data.access_token; 
    } catch (error) {
        console.error('Login failed:', error);
        throw error; 
    }
};
