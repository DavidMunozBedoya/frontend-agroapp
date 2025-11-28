import type { Species } from '../types';

const API_URL = 'http://localhost:3300/species';

export const speciesService = {
    getAll: async (): Promise<Species[]> => {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Error fetching species');
        }
        return response.json();
    },

    create: async (data: Omit<Species, 'idSpecies'>): Promise<Species> => {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Error creating species');
        }
        return response.json();
    },

    update: async (id: number, data: Partial<Species>): Promise<Species> => {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Error updating species');
        }
        return response.json();
    },

    delete: async (id: number): Promise<void> => {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Error deleting species');
        }
    }
};
