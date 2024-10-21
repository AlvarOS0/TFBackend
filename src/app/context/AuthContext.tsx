import React, { createContext, useContext, useState } from 'react';
import { login as authLogin } from '../lib/auth'; 
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

interface User {
    email: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    const login = async (email: string, password: string) => {
        try {
            const token = await authLogin(email, password);
            Cookies.set('token', token, { expires: 7 });
            setUser({ email });
            router.push('/crud'); 
        } catch (error) {
            console.error('Login failed:', error);
            throw error; 
        }
    };

    const logout = () => {
        Cookies.remove('token');
        setUser(null);
        router.push('/'); 
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
