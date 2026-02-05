import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import apiClient from '../shared/api/apiClient';
import type { User } from '../shared/types/user';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (credentials: any) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    // Initialize user from localStorage if available to prevent flash of login page
    const [user, setUser] = useState<User | null>(() => {
        const savedUser = localStorage.getItem('smartshop_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [isLoading, setIsLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const response = await apiClient.get('/auth/me');
            setUser(response.data);
            localStorage.setItem('smartshop_user', JSON.stringify(response.data));
        } catch (error: any) {
            // Only log out if explicitly unauthorized (401) or forbidden (403)
            // This prevents logout when server is restarting (Network Error) or 500
            if (error.response && error.response.status === 401) {
                setUser(null);
                localStorage.removeItem('smartshop_user');
            } else {
                console.warn("Auth check warning - keeping session", error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (credentials: any) => {
        const response = await apiClient.post('/auth/login', credentials);
        setUser(response.data);
        localStorage.setItem('smartshop_user', JSON.stringify(response.data));
    };

    const logout = async () => {
        try {
            await apiClient.post('/auth/logout');
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            setUser(null);
            localStorage.removeItem('smartshop_user');
            window.location.href = '/login';
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
