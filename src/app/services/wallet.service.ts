import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Wallet, WalletTransaction } from '../models/wallet.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
    providedIn: 'root'
})
export class WalletService {

    private apiUrl = '/api/wallets';

    constructor(private http: HttpClient) { }

    private getHeaders() {
        const userId = localStorage.getItem('userId');
        return { headers: { 'X-User-Id': userId || '0' } };
    }

    sendSmsOtp(mobileNumber: string): Observable<ApiResponse<string>> {
        return this.http.post<ApiResponse<string>>(`${this.apiUrl}/kyc/send-sms`, { mobileNumber }, this.getHeaders());
    }

    verifyKyc(mobileNumber: string, otp: string): Observable<ApiResponse<Wallet>> {
        return this.http.post<ApiResponse<Wallet>>(`${this.apiUrl}/kyc/verify`, { mobileNumber, otp }, this.getHeaders());
    }

    getBalance(): Observable<ApiResponse<Wallet>> {
        return this.http.get<ApiResponse<Wallet>>(`${this.apiUrl}/balance`, this.getHeaders());
    }

    createRazorpayOrder(amount: number): Observable<ApiResponse<string>> {
        return this.http.post<ApiResponse<string>>(`${this.apiUrl}/create-razorpay-order`, { amount }, this.getHeaders());
    }

    verifyPayment(amount: number, razorpayPaymentId: string, razorpayOrderId: string, razorpaySignature: string): Observable<ApiResponse<Wallet>> {
        const payload = {
            amount,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature
        };
        return this.http.post<ApiResponse<Wallet>>(`${this.apiUrl}/verify-payment`, payload, this.getHeaders());
    }

    getTransactions(): Observable<ApiResponse<WalletTransaction[]>> {
        return this.http.get<ApiResponse<WalletTransaction[]>>(`${this.apiUrl}/transactions`, this.getHeaders());
    }
}
