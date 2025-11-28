import type { Novelty, Category, Lote } from '../types';

const API_URL = 'http://localhost:3300/novelties';

export const noveltiesService = {
    getCategories: async (): Promise<Category[]> => {
        const response = await fetch('http://localhost:3300/novelty-categories');
        if (!response.ok) {
            throw new Error('Error fetching categories');
        }
        const result = await response.json();
        console.log('Categories response:', result);
        return result.data || result || [];
    },

    getLotes: async (): Promise<Lote[]> => {
        const response = await fetch('http://localhost:3300/batch');
        if (!response.ok) {
            throw new Error('Error fetching lotes');
        }
        const result = await response.json();
        console.log('Lotes response:', result);
        return result.data || result || [];
    },

    getAll: async (): Promise<Novelty[]> => {
        console.log(`Fetching novelties from: ${API_URL}`);
        try {
            const response = await fetch(`${API_URL}`);
            console.log(`Response status: ${response.status}`);

            if (!response.ok) {
                const text = await response.text();
                console.error(`Error response: ${text}`);
                throw new Error(`Error fetching novelties: ${response.status} ${response.statusText}`);
            }
            const result = await response.json();
            console.log('Response data:', result);

            // Backend returns {status: "Success", data: [...]}
            return result.data || [];
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    },

    create: async (data: Omit<Novelty, 'idNovelties'>): Promise<any> => {
        console.log('Creating novelty with data:', data);

        const response = await fetch(`${API_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        console.log('Create response status:', response.status);
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Create error response:', errorText);
            throw new Error('Error creating novelty');
        }
        return response.json();
    },

    update: async (id: number, data: Partial<Novelty>): Promise<any> => {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Error updating novelty');
        }
        return response.json();
    },

    delete: async (id: number): Promise<void> => {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Error deleting novelty');
        }
    }
};
