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