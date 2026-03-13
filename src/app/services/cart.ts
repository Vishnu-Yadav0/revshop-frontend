import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';

export interface CartItemDTO {
    cartItemId?: number;
    productId: number;
    productName?: string;
    price?: number;
    sellingPrice?: number;
    quantity: number;
    subtotal?: number;
    imageUrl?: string;
}

export interface CartDTO {
    cartId: number;
    items: CartItemDTO[];
    totalPrice: number;
}

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private apiUrl = '/api/carts';

    constructor(private http: HttpClient) { }

    getCartByUserId(userId: number): Observable<ApiResponse<CartDTO>> {
        return this.http.get<ApiResponse<CartDTO>>(`${this.apiUrl}/user/${userId}`);
    }

    addItemToCart(userId: number, productId: number, quantity: number): Observable<ApiResponse<any>> {
        const body = { productId, quantity };
        return this.http.post<ApiResponse<any>>(`${this.apiUrl}/user/${userId}/add`, body);
    }

    updateItemQuantity(userId: number, productId: number, quantity: number): Observable<ApiResponse<any>> {
        const body = { productId, quantity };
        return this.http.put<ApiResponse<any>>(`${this.apiUrl}/user/${userId}/update`, body);
    }

    removeItemFromCart(userId: number, productId: number): Observable<ApiResponse<any>> {
        return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/user/${userId}/remove/${productId}`);
    }

    clearCart(userId: number): Observable<ApiResponse<void>> {
        return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/user/${userId}/clear`);
    }
}
