import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError } from 'axios';

interface AuthContextData {
    user: any;
    loading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStoredData();
    }, []);

    async function loadStoredData() {
        try {
            const storedUser = await AsyncStorage.getItem('@DummyRecipes:user');
            const storedToken = await AsyncStorage.getItem('@DummyRecipes:token');

            if (storedUser && storedToken) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error('Error loading stored data:', error);
        } finally {
            setLoading(false);
        }
    }

    async function login(username: string, password: string) {
        try {
            const response = await axios.post('https://dummyjson.com/auth/login', {
                username,
                password,
                expiresInMins: 30, 
            }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true 
            });

            const { token, ...userData } = response.data;

            if (!token) {
                throw new Error('No token received from the server');
            }

            await AsyncStorage.setItem('@DummyRecipes:user', JSON.stringify(userData));
            await AsyncStorage.setItem('@DummyRecipes:token', token);

            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser(userData);
        } catch (error) {
            console.error('Login error:', error);
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 400) {
                    throw new Error('Invalid username or password');
                } else {
                    throw new Error('An error occurred during login. Please try again.');
                }
            } else {
                throw error;
            }
        }
    }

    async function logout() {
        try {
            await AsyncStorage.removeItem('@DummyRecipes:user');
            await AsyncStorage.removeItem('@DummyRecipes:token');
            axios.defaults.headers.common['Authorization'] = '';
            setUser(null);
        } catch (error) {
            console.error('Error during logout:', error);
        }
    }
    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthProvider;