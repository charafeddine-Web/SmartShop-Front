export interface OrderItem {
    id?: number;
    productId: number;
    productName?: string;
    quantity: number;
    price: number;
    totalLine: number;
}

export interface Order {
    id: number;
    clientId: number;
    clientUsername?: string;
    orderDate: string;
    subtotal: number;
    discount: number;
    tva: number;
    total: number;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELED' | 'REJECTED';
    items: OrderItem[];
    promoCode?: string;
    remainingAmount: number;
}
