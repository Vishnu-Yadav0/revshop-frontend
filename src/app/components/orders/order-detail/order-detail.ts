import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Navbar } from '../../shared/navbar/navbar'; // Although Navbar is standalone, we can just use NotificationService
import { OrderService } from '../../../services/order';
import { NotificationService } from '../../../services/notification.service';
import { FormsModule } from '@angular/forms';
import { ApiResponse } from '../../../models/api-response.model';


@Component({
    selector: 'app-order-detail',
    standalone: true,
    imports: [CommonModule, FormsModule, DatePipe],
    templateUrl: './order-detail.html',
    styleUrl: './order-detail.css'
})
export class OrderDetailComponent implements OnInit {
    order = signal<any>(null);
    trackingHistory = signal<any[]>([]);
    loading = signal<boolean>(true);
    trackingLoading = signal<boolean>(true);
    toastMessage = signal<string>('');
    toastType = signal<'success' | 'error'>('success');
    showToast = signal<boolean>(false);
    showReturnModal = signal<boolean>(false);
    returnReason = 'Defective Product';
    actionLoading = signal<boolean>(false);

    private orderId!: number;

    returnReasons = [
        'Defective Product',
        'Wrong Item Delivered',
        'Changed Mind',
        'Other'
    ];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private orderService: OrderService,
        private notificationService: NotificationService
    ) { }

    ngOnInit(): void {
        this.orderId = Number(this.route.snapshot.paramMap.get('id'));
        this.loadData();
    }

    loadData(): void {
        this.loading.set(true);
        this.trackingLoading.set(true);

        // Fetch Order first so UI can render immediately
        this.orderService.getOrderById(this.orderId).subscribe({
            next: (orderRes: ApiResponse<any>) => {
                this.order.set(orderRes.data);
                this.loading.set(false); // Order card + Cancel button now visible

                // Fetch Tracking independently
                this.loadTracking();
            },
            error: () => {
                this.loading.set(false);
                this.trackingLoading.set(false);
                this.showToastMsg('Failed to load order details', 'error');
            }
        });
    }

    private loadTracking(): void {
        this.orderService.getOrderTracking(this.orderId).subscribe({
            next: (trackingRes: ApiResponse<any[]>) => {
                const sorted = (trackingRes.data || []).slice().sort(
                    (a: any, b: any) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime()
                );
                this.trackingHistory.set(sorted);
                this.trackingLoading.set(false);
            },
            error: () => {
                this.trackingLoading.set(false);
                // We don't block the UI if tracking fails, maybe just show empty tracking or error state
                console.error('Failed to load tracking data');
            }
        });
    }

    getStatusIndex(status: string): number {
        switch (status?.toUpperCase()) {
            case 'PENDING': return 0;
            case 'PROCESSING': return 1;
            case 'SHIPPED': return 2;
            case 'OUT_FOR_DELIVERY': return 3;
            case 'DELIVERED': return 4;
            default: return -1; // CANCELLED, RETURN_REQUESTED etc.
        }
    }

    isCancelled(): boolean {
        return this.order()?.status?.toUpperCase() === 'CANCELLED';
    }

    getStatusBadgeClass(status: string): string {
        switch (status?.toUpperCase()) {
            case 'PENDING': return 'badge-pending';
            case 'PROCESSING': return 'badge-processing';
            case 'SHIPPED': return 'badge-shipped';
            case 'OUT_FOR_DELIVERY': return 'badge-shipped'; // Reuse shipped color
            case 'DELIVERED': return 'badge-delivered';
            case 'CANCELLED': return 'badge-cancelled';
            case 'RETURN_REQUESTED': return 'badge-return';
            case 'RETURN_APPROVED': return 'badge-return-approved';
            default: return 'badge-default';
        }
    }

    getTrackingBadgeClass(status: string): string {
        const s = status?.toUpperCase();
        if (s === 'DELIVERED' || s === 'RETURN_APPROVED') return 'track-badge-green';
        if (s === 'SHIPPED' || s === 'OUT_FOR_DELIVERY') return 'track-badge-orange';
        if (s === 'PROCESSING') return 'track-badge-blue';
        if (s === 'CANCELLED') return 'track-badge-red';
        if (s === 'RETURN_REQUESTED') return 'track-badge-purple';
        return 'track-badge-gray';
    }

    canCancel(): boolean {
        const s = this.order()?.status?.toUpperCase();
        return s === 'PENDING' || s === 'PROCESSING';
    }

    canReturn(): boolean {
        return this.order()?.status?.toUpperCase() === 'DELIVERED';
    }

    isReturnRequested(): boolean {
        return this.order()?.status?.toUpperCase() === 'RETURN_REQUESTED';
    }

    cancelOrder(): void {
        if (!confirm('Are you sure you want to cancel this order?')) return;
        const userId = Number(localStorage.getItem('userId'));
        this.actionLoading.set(true);
        this.orderService.cancelOrder(this.orderId, userId).subscribe({
            next: () => {
                this.showToastMsg('Order cancelled successfully', 'success');
                this.actionLoading.set(false);
                this.notificationService.triggerRefresh();
                this.loadData();
            },
            error: () => {
                this.showToastMsg('Failed to cancel order. Please try again.', 'error');
                this.actionLoading.set(false);
            }
        });
    }

    openReturnModal(): void {
        this.returnReason = 'Defective Product';
        this.showReturnModal.set(true);
    }

    closeReturnModal(): void {
        this.showReturnModal.set(false);
    }

    submitReturn(): void {
        const userId = Number(localStorage.getItem('userId'));
        this.actionLoading.set(true);
        this.orderService.requestReturn(this.orderId, userId, this.returnReason).subscribe({
            next: (res: ApiResponse<void>) => {
                this.showReturnModal.set(false);
                this.showToastMsg('Return request submitted successfully', 'success');
                this.actionLoading.set(false);
                this.notificationService.triggerRefresh();
                this.loadData();
            },
            error: () => {
                this.showToastMsg('Failed to submit return request. Please try again.', 'error');
                this.actionLoading.set(false);
            }
        });
    }

    private showToastMsg(msg: string, type: 'success' | 'error'): void {
        this.toastMessage.set(msg);
        this.toastType.set(type);
        this.showToast.set(true);
        setTimeout(() => this.showToast.set(false), 3500);
    }

    goBack(): void {
        this.router.navigate(['/orders']);
    }
}
