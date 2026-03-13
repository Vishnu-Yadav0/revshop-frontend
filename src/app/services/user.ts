import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';

export interface UserDTO {
    userId: number;
    name: string;
    email: string;
    phone: string;
    age: number;
    role: string;
}

export interface PasswordUpdateRequest {
    oldPassword: string;
    newPassword: string;
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = '/api/users';

    constructor(private http: HttpClient) { }

    getUserById(id: number): Observable<ApiResponse<UserDTO>> {
        return this.http.get<ApiResponse<UserDTO>>(`${this.apiUrl}/${id}`);
    }

    updateProfile(id: number, userData: UserDTO): Observable<ApiResponse<UserDTO>> {
        return this.http.put<ApiResponse<UserDTO>>(`${this.apiUrl}/${id}`, userData);
    }

    updatePassword(id: number, request: PasswordUpdateRequest): Observable<ApiResponse<void>> {
        return this.http.put<ApiResponse<void>>(`${this.apiUrl}/${id}/password`, request);
    }

    deactivateAccount(id: number): Observable<ApiResponse<void>> {
        return this.http.put<ApiResponse<void>>(`${this.apiUrl}/${id}/deactivate`, {});
    }

    deleteAccount(id: number): Observable<ApiResponse<void>> {
        return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
    }
}
