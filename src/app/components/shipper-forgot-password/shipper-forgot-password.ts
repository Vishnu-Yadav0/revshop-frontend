import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ShipperService } from '../../services/shipper.service';
import { ToastService } from '../../services/toast';

@Component({
    selector: 'app-shipper-forgot-password',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './shipper-forgot-password.html',
    styleUrl: '../shipper-login/shipper-login.css'
})
export class ShipperForgotPasswordComponent {
    form: FormGroup;
    submitted = false;
    loading = false;
    linkSent = false;

    constructor(
        private fb: FormBuilder,
        private shipperService: ShipperService,
        private toastService: ToastService
    ) {
        this.form = this.fb.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }

    get f() { return this.form.controls; }

    onSubmit(): void {
        this.submitted = true;
        if (this.form.invalid) return;

        this.loading = true;
        const email = this.form.get('email')!.value;

        this.shipperService.shipperForgotPassword(email).subscribe({
            next: (res) => {
                this.linkSent = true;
                this.loading = false;
                this.toastService.success(res.message || 'Reset link sent to your email!');
            },
            error: (err) => {
                this.loading = false;
                this.toastService.error(err.error?.message || 'Failed to send reset link. Please check your email address.');
            }
        });
    }
}
