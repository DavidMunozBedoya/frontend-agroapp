// src/services/authService.ts
import type { LoginCredentials, LoginResponse, } from '../types/index';

const API_URL = 'http://localhost:3300/users'; // Ajusta tu puerto

export const authService = {
    login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al iniciar sesión');
        }
        
        return response.json();
    },

};