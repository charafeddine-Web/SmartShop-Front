import apiClient from './apiClient';
import type { Client } from '../types/client';

export const clientApi = {
    getAll: () => apiClient.get<Client[]>('/clients/all'),
    getById: (id: number) => apiClient.get<Client>(`/clients/${id}`),
    create: (client: Client) => apiClient.post<Client>('/clients/save', client),
    update: (id: number, client: Client) => apiClient.put<Client>(`/clients/update/${id}`, client),
    delete: (id: number) => apiClient.delete(`/clients/delete/${id}`),
};

export const productApi = {
    getAll: (page = 0, size = 10) => apiClient.get<any>(`/products?page=${page}&size=${size}`),
    getById: (id: number) => apiClient.get<any>(`/products/${id}`),
    create: (product: any) => apiClient.post<any>('/products/save', product),
    update: (id: number, product: any) => apiClient.put<any>(`/products/${id}`, product),
    delete: (id: number) => apiClient.delete(`/products/${id}`),
};

export const orderApi = {
    getAll: () => apiClient.get<any[]>('/orders/all'),
    delete: (id: number) => apiClient.delete(`/orders/${id}`),
    confirm: (id: number) => apiClient.put(`/orders/${id}/confirm`),
    cancel: (id: number) => apiClient.put(`/orders/${id}/cancel`),
};
