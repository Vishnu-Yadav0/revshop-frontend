import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';

export interface AddressDTO {
    addressId?: number;
    addressLine: string;
    street?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault: boolean;
    userId?: number;
    addressType?: string;
}

@Injectable({
    providedIn: 'root'
})
export class AddressService {
    private apiUrl = '/api/addresses';

    constructor(private http: HttpClient) { }

    getAddressesByUser(userId: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/user/${userId}`);
    }

    addAddress(address: AddressDTO): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}`, address);
    }

    updateAddress(id: number, address: AddressDTO): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, address);
    }

    deleteAddress(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }
}
