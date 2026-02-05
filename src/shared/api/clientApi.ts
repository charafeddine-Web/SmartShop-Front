import apiClient from './apiClient';
import type { Client } from '../types/client';
import type { Order } from '../types/order';

export const clientApi = {
    getMe: () => apiClient.get<Client>('/clients/me'),
    getOrders: (clientId: number) => apiClient.get<Order[]>(`/clients/${clientId}/orders`),
    getProducts: (page = 0, size = 10) => apiClient.get<any>(`/products?page=${page}&size=${size}`),
    createOrder: (order: Partial<Order>) => apiClient.post<Order>('/orders', order),
};
