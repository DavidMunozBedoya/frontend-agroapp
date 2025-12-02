
export interface Species {
    idSpecies: number;
    Specie_Name: string;
}

export interface User {
    idUsers: number;
    user_name: string;
    email_user: string;
    phone_number: string;
    // No incluimos password por seguridad
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface LoginResponse {
    status: string;
    message: string;
    data: User;

}
export interface Category {
    idNovelty_Categories: number;
    Category_Name: string;
}

export interface Lote {
    idBatches: number;
    Starting_Date?: string;
    Unit_Cost?: number;
    Batch_Name?: string;
    // Add other fields as needed
}

export interface State {
    idStates: number;
    State_Name: string;
}

export interface Novelty {
    idNovelties?: number; // Optional for creation
    Quantity: number;
    Description: string;
    Date_Novelty: string;
    Batches_idBatches: number;
    Novelty_Categories_idNovelty_Categories: number;
}

export interface Batch {
    idBatch: number;
    Starting_Date: string;
    Unit_Cost: number;
    Total_Quantity: number;
    Cost: number;
    Weight_Batch: number;
    Age_Batch: number;
    Species_idSpecies: number;
    States_idStates: number;
}