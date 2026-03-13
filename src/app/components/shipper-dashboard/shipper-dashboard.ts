import { Component, OnInit, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ShipperService, ShipperOrder } from '../../services/shipper.service';
import { ToastService } from '../../services/toast';
import { ThemeService } from '../../services/theme.service';
import { NotificationService } from '../../services/notification.service';
import { ApiResponse } from '../../models/api-response.model';


@Component({
    selector: 'app-shipper-dashboard',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './shipper-dashboard.html',
    styleUrl: './shipper-dashboard.css'
})
export class ShipperDashboardComponent implements OnInit {
    shipperName = signal<string>('');
    shipperVehicle = signal<string>('');
    shipperId = signal<number>(0);
    isAvailable = signal<boolean>(true);

    allOrders = signal<ShipperOrder[]>([]);
    loading = signal<boolean>(true);
    activeTab = signal<string>('all');
    updatingOrderId = signal<number | null>(null);

    // Computed filtered lists
    pendingOrders = computed(() => this.allOrders().filter(o => ['SHIPPED', 'PROCESSING', 'OUT_FOR_DELIVERY'].includes(o.status)));
    inTransitOrders = computed(() => this.allOrders().filter(o => ['SHIPPED', 'OUT_FOR_DELIVERY'].includes(o.status)));
    deliveredOrders = computed(() => this.allOrders().filter(o => o.status === 'DELIVERED'));

    filteredOrders = computed(() => {
        switch (this.activeTab()) {
            case 'pending': return this.pendingOrders();
            case 'delivered': return this.deliveredOrders();
            default: return this.allOrders();
        }
    });

    constructor(
        private shipperService: ShipperService,
        private router: Router,
        private toastService: ToastService,
        public themeService: ThemeService,
        private notificationService: NotificationService
    ) { }

    ngOnInit(): void {
        const id = localStorage.getItem('shipperId');
        const name = localStorage.getItem('shipperName') || 'Shipper';
        const vehicle = localStorage.getItem('shipperVehicle') || '';

        if (!id) {
            this.router.navigate(['/shipper-login']);
            return;
        }

        this.shipperId.set(Number(id));
        this.shipperName.set(name);
        this.shipperVehicle.set(vehicle);
        this.loadOrders();
    }

    loadOrders(): void {
        this.loading.set(true);
        this.shipperService.getOrdersByShipper(this.shipperId()).subscribe({
            next: (res: ApiResponse<ShipperOrder[]>) => {
                this.allOrders.set(res.data ?? []);
                this.loading.set(false);
            },
            error: () => {
                this.toastService.error('Failed to load orders');
                this.loading.set(false);
            }
        });
    }

    setTab(tab: string): void {
        this.activeTab.set(tab);
    }

    updateStatus(order: ShipperOrder, status: string): void {
        this.updatingOrderId.set(order.orderId);
        this.shipperService.updateOrderStatus(this.shipperId(), order.orderId, status).subscribe({
            next: () => {
                this.toastService.success(`Order #${order.orderNumber} updated to ${status}`);
                this.updatingOrderId.set(null);
                this.notificationService.triggerRefresh();
                this.loadOrders();
            },
            error: () => {
                this.toastService.error('Failed to update order status');
                this.updatingOrderId.set(null);
            }
        });
    }

    getNextStatus(currentStatus: string): { label: string; value: string; color: string } | null {
        if (!currentStatus) return null;
        const status = currentStatus.trim().toUpperCase();
        switch (status) {
            case 'PROCESSING': return { label: 'Mark as Picked Up', value: 'SHIPPED', color: 'blue' };
            case 'SHIPPED': return { label: 'Out for Delivery', value: 'OUT_FOR_DELIVERY', color: 'orange' };
            case 'OUT_FOR_DELIVERY': return { label: 'Mark as Delivered', value: 'DELIVERED', color: 'green' };
            default: return null;
        }
    }

    getStatusColor(status: string): string {
        switch (status) {
            case 'PROCESSING': return 'status-processing';
            case 'SHIPPED': return 'status-shipped';
            case 'OUT_FOR_DELIVERY': return 'status-out-for-delivery';
            case 'DELIVERED': return 'status-delivered';
            case 'CANCELLED': return 'status-cancelled';
            default: return 'status-pending';
        }
    }

    getStatusIcon(status: string): string {
        switch (status) {
            case 'PROCESSING': return 'fa-solid fa-box';
            case 'SHIPPED': return 'fa-solid fa-truck';
            case 'OUT_FOR_DELIVERY': return 'fa-solid fa-motorcycle';
            case 'DELIVERED': return 'fa-solid fa-circle-check';
            case 'CANCELLED': return 'fa-solid fa-circle-xmark';
            default: return 'fa-solid fa-clock';
        }
    }

    getTrackingStep(status: string): number {
        const steps: Record<string, number> = {
            'PENDING': 0,
            'PROCESSING': 1,
            'SHIPPED': 2,
            'OUT_FOR_DELIVERY': 3,
            'DELIVERED': 4
        };
        return steps[status] ?? 0;
    }

    toggleAvailability(): void {
        const newVal = !this.isAvailable();
        this.shipperService.updateAvailability(this.shipperId(), newVal).subscribe({
            next: () => {
                this.isAvailable.set(newVal);
                this.toastService.success(`You are now ${newVal ? 'available' : 'unavailable'}`);
            },
            error: () => this.toastService.error('Failed to update availability')
        });
    }

    logout(): void {
        localStorage.removeItem('shipperId');
        localStorage.removeItem('shipperName');
        localStorage.removeItem('shipperEmail');
        localStorage.removeItem('shipperVehicle');
        localStorage.removeItem('shipperToken');
        localStorage.removeItem('role');
        this.router.navigate(['/shipper-login']);
    }

    formatDate(dateStr: string): string {
        if (!dateStr) return 'N/A';
        try {
            return new Date(dateStr).toLocaleDateString('en-IN', {
                day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
            });
        } catch { return dateStr; }
    }

    formatCurrency(amount: number): string {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount || 0);
    }
}
