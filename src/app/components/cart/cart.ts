import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService, CartDTO } from '../../services/cart';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule],
    templateUrl: './cart.html',
    styleUrl: './cart.css'
})
export class CartComponent implements OnInit {
    cart = signal<CartDTO | null>(null);
    loading = signal<boolean>(true);

    constructor(private cartService: CartService) { }

    ngOnInit(): void {
        this.loadCart();
    }

    loadCart(): void {
        const userId = localStorage.getItem('userId');
        if (userId) {
            this.cartService.getCartByUserId(Number(userId)).subscribe({
                next: (res) => {
                    this.cart.set(res.data);
                    this.loading.set(false);
                },
                error: () => this.loading.set(false)
            });
        } else {
            this.loading.set(false);
        }
    }

    updateQuantity(productId: number, quantity: number): void {
        const userId = localStorage.getItem('userId');
        if (userId && quantity >= 1) {
            this.cartService.updateItemQuantity(Number(userId), productId, quantity).subscribe({
                next: () => this.loadCart()
            });
        }
    }

    removeItem(productId: number): void {
        const userId = localStorage.getItem('userId');
        if (userId) {
            this.cartService.removeItemFromCart(Number(userId), productId).subscribe({
                next: () => this.loadCart()
            });
        }
    }

    clearCart(): void {
        const userId = localStorage.getItem('userId');
        if (userId) {
            this.cartService.clearCart(Number(userId)).subscribe({
                next: () => this.cart.set(null)
            });
        }
    }
}
