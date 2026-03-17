import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { TrackingDetail } from '../models/tracking.model';

@Injectable({ providedIn: 'root' })
export class TrackingService {
    private baseUrl = '/api/orders';

    constructor(private http: HttpClient) { }

    getTrackingDetails(orderId: number): Observable<ApiResponse<TrackingDetail[]>> {
        return this.http.get<ApiResponse<TrackingDetail[]>>(`/api/tracking/order/${orderId}`);
    }
}
