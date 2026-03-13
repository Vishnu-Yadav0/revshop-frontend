import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';

export interface ShipperDTO {
    shipperId: number;
    name: string;
    phone: string;
    email: string;
    vehicleNumber: string;
    isAvailable: boolean;
}

export interface ShipperOrderItem {
    productName: string;
    quantity: number;
    price: number;
}

export interface ShipperAddress {
    addressLine: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
}

export interface ShipperOrder {
    orderId: number;
    orderNumber: string;
    status: string;
    totalAmount: number;
    customerName: string;
    customerPhone: string;
    shippingAddress?: ShipperAddress;
    orderItems?: ShipperOrderItem[];
    orderDate: string;
}

@Injectable({
    providedIn: 'root'
})
export class ShipperService {
    private apiUrl = '/api/shippers';
    private authUrl = '/api/auth';

    constructor(private http: HttpClient) { }

    getAllShippers(): Observable<ApiResponse<ShipperDTO[]>> {
        return this.http.get<ApiResponse<ShipperDTO[]>>(this.apiUrl);
    }

    getAvailableShippers(): Observable<ApiResponse<ShipperDTO[]>> {
        return this.http.get<ApiResponse<ShipperDTO[]>>(`${this.apiUrl}/available`);
    }

    assignShipper(shipperId: number, orderId: number): Observable<ApiResponse<any>> {
        return this.http.post<ApiResponse<any>>(`${this.apiUrl}/${shipperId}/assign/${orderId}`, {});
    }

    createShipper(shipper: Partial<ShipperDTO>): Observable<ApiResponse<ShipperDTO>> {
        return this.http.post<ApiResponse<ShipperDTO>>(this.apiUrl, shipper);
    }

    loginShipper(email: string, password: string): Observable<ApiResponse<any>> {
        return this.http.post<ApiResponse<any>>(`${this.apiUrl}/login`, { email, password });
    }

    registerShipper(data: { name: string; email: string; phone: string; vehicleNumber: string; password: string }): Observable<ApiResponse<any>> {
        return this.http.post<ApiResponse<any>>(`${this.apiUrl}`, data);
    }

    getOrdersByShipper(shipperId: number): Observable<ApiResponse<ShipperOrder[]>> {
        return this.http.get<ApiResponse<ShipperOrder[]>>(`${this.apiUrl}/${shipperId}/orders`);
    }

    updateOrderStatus(shipperId: number, orderId: number, status: string): Observable<ApiResponse<any>> {
        return this.http.patch<ApiResponse<any>>(
            `${this.apiUrl}/${shipperId}/orders/${orderId}/status`,
            null,
            { params: { status } }
        );
    }

    updateAvailability(shipperId: number, available: boolean): Observable<ApiResponse<ShipperDTO>> {
        return this.http.patch<ApiResponse<ShipperDTO>>(
            `${this.apiUrl}/${shipperId}/availability`,
            null,
            { params: { available: available.toString() } }
        );
    }
}
