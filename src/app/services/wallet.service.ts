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

    sendSmsOtp(mobileNumber: string): Observable<ApiResponse<string>> {
        return this.http.post<ApiResponse<string>>(`${this.apiUrl}/kyc/send-sms`, { mobileNumber });
    }

    verifyKyc(mobileNumber: string, otp: string): Observable<ApiResponse<Wallet>> {
        return this.http.post<ApiResponse<Wallet>>(`${this.apiUrl}/kyc/verify`, { mobileNumber, otp });
    }

    getBalance(): Observable<ApiResponse<Wallet>> {
        return this.http.get<ApiResponse<Wallet>>(`${this.apiUrl}/balance`);
    }

    createRazorpayOrder(amount: number): Observable<ApiResponse<string>> {
        return this.http.post<ApiResponse<string>>(`${this.apiUrl}/create-razorpay-order`, { amount });
    }

    verifyPayment(amount: number, razorpayPaymentId: string, razorpayOrderId: string, razorpaySignature: string): Observable<ApiResponse<Wallet>> {
        const payload = {
            amount,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature
        };
        return this.http.post<ApiResponse<Wallet>>(`${this.apiUrl}/verify-payment`, payload);
    }

    getTransactions(): Observable<ApiResponse<WalletTransaction[]>> {
        return this.http.get<ApiResponse<WalletTransaction[]>>(`${this.apiUrl}/transactions`);
    }
}
