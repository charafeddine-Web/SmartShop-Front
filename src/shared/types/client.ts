export interface Client {
    id?: number;
    username: string;
    email: string;
    password?: string;
    fidelityLevel?: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
    totalOrders: number;
    totalSpent: number;
}
