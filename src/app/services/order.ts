import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';

export interface OrderRequestDTO {
    userId: number;
    shippingAddressId: number;
    billingAddressId: number;
    paymentMethod: string;
    items: { productId: number; quantity: number }[];
}

export interface OrderResponseDTO {
    orderId: number;
    orderNumber: string;
    totalAmount: number;
    status: string;
    orderDate: string;
    paymentMethod?: string;
    buyerName?: string;
    buyerEmail?: string;
    items?: any[];
}

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private apiUrl = '/api/orders';

    constructor(private http: HttpClient) { }

    placeOrder(userId: number, request: OrderRequestDTO): Observable<ApiResponse<OrderResponseDTO>> {
        return this.http.post<ApiResponse<OrderResponseDTO>>(`${this.apiUrl}/place`, request);
    }

    getOrderById(orderId: number): Observable<ApiResponse<OrderResponseDTO>> {
        return this.http.get<ApiResponse<OrderResponseDTO>>(`${this.apiUrl}/${orderId}`);
    }

    getOrderTracking(orderId: number): Observable<ApiResponse<any[]>> {
        return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/${orderId}/tracking`);
    }

    getOrdersByUserId(userId: number): Observable<ApiResponse<OrderResponseDTO[]>> {
        return this.http.get<ApiResponse<OrderResponseDTO[]>>(`${this.apiUrl}/user/${userId}`);
    }

    cancelOrder(orderId: number, userId: number): Observable<ApiResponse<void>> {
        return this.http.put<ApiResponse<void>>(`${this.apiUrl}/${orderId}/cancel`, { userId });
    }

    requestReturn(orderId: number, userId: number, reason: string): Observable<ApiResponse<void>> {
        return this.http.put<ApiResponse<void>>(`${this.apiUrl}/${orderId}/return`, { userId, reason });
    }

    updateOrderStatus(orderId: number, status: string, sellerId: number): Observable<ApiResponse<OrderResponseDTO>> {
        return this.http.put<ApiResponse<OrderResponseDTO>>(`${this.apiUrl}/${orderId}/status`, { status, sellerId });
    }

    getSellerOrders(sellerId: number): Observable<ApiResponse<OrderResponseDTO[]>> {
        return this.http.get<ApiResponse<OrderResponseDTO[]>>(`${this.apiUrl}/seller/${sellerId}`);
    }

    getSellerStats(sellerId: number): Observable<ApiResponse<any>> {
        return this.http.get<ApiResponse<any>>(`${this.apiUrl}/seller/${sellerId}/stats`);
    }
}
