import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ShipperService } from '../../services/shipper.service';
import { AuthService } from '../../services/auth';
import { ApiResponse } from '../../models/api-response.model';
import { ToastService } from '../../services/toast';


function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirm = control.get('confirmPassword');
    if (password && confirm && password.value !== confirm.value) {
        return { passwordMismatch: true };
    }
    return null;
}

@Component({
    selector: 'app-shipper-register',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, RouterLink],
    templateUrl: './shipper-register.html',
    styleUrl: './shipper-register.css'
})
export class ShipperRegisterComponent {
    form: FormGroup;
    submitted = false;
    loading = false;
    errorMessage = '';
    successMessage = '';
    showPassword = false;
    showConfirm = false;

    // OTP state
    otpSent = false;
    otpVerified = false;

    constructor(
        private fb: FormBuilder,
        private shipperService: ShipperService,
        private authService: AuthService,
        private router: Router,
        private toastService: ToastService
    ) {
        this.form = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(3)]],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
            vehicleNumber: ['', [Validators.required]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required],
            otp: ['']
        }, { validators: passwordMatchValidator });
    }

    get f() { return this.form.controls; }

    onSubmit(): void {
        this.submitted = true;
        this.errorMessage = '';
        this.successMessage = '';

        // Step 1: Send OTP — only email field needs to be valid
        if (!this.otpSent) {
            const emailControl = this.form.get('email');
            if (!emailControl || emailControl.invalid) {
                this.toastService.error('Please enter a valid email address first.');
                return;
            }
            this.loading = true;
            this.authService.sendOtp(emailControl.value).subscribe({
                next: () => {
                    this.otpSent = true;
                    this.loading = false;
                    this.toastService.success('OTP sent! Please check your email.');
                    this.form.get('otp')?.setValidators([Validators.required, Validators.pattern('^[0-9]{6}$')]);
                    this.form.get('otp')?.updateValueAndValidity();
                },
                error: (err) => {
                    this.loading = false;
                    this.errorMessage = err.error?.message || 'Failed to send OTP. Please try again.';
                    this.toastService.error(this.errorMessage);
                }
            });
            return;
        }

        // Step 2: Verify OTP
        if (!this.otpVerified) {
            const otp = this.form.get('otp')?.value;
            if (!otp || otp.length !== 6) {
                this.toastService.error('Please enter the 6-digit OTP sent to your email.');
                return;
            }
            this.loading = true;
            this.authService.verifyOtp(this.form.get('email')?.value, otp).subscribe({
                next: () => {
                    this.otpVerified = true;
                    this.loading = false;
                    this.toastService.success('Email verified! Please complete your registration.');
                },
                error: (err) => {
                    this.loading = false;
                    this.errorMessage = err.error?.message || 'Invalid or expired OTP.';
                    this.toastService.error(this.errorMessage);
                }
            });
            return;
        }

        // Step 3: Full form validation then register
        if (this.form.invalid) {
            this.toastService.error('Please fill in all required fields before registering.');
            return;
        }

        this.loading = true;
        const { name, email, phone, vehicleNumber, password } = this.form.value;

        this.shipperService.registerShipper({ name, email, phone, vehicleNumber, password }).subscribe({
            next: (res: ApiResponse<any>) => {
                const data = res.data;
                localStorage.setItem('shipperId', data.shipperId?.toString() || '');
                localStorage.setItem('shipperName', data.name || '');
                localStorage.setItem('shipperEmail', data.email || '');
                localStorage.setItem('shipperVehicle', data.vehicleNumber || '');
                localStorage.setItem('shipperToken', data.token || '');
                localStorage.setItem('role', 'SHIPPER');
                this.loading = false;
                this.toastService.success('Shipper registered successfully! Logging you in...');
                this.router.navigate(['/shipper-dashboard']);
            },
            error: (err) => {
                this.errorMessage = err.error?.message || 'Registration failed. Please try again.';
                this.toastService.error(this.errorMessage);
                this.loading = false;
            }
        });
    }

    resendOtp(): void {
        const email = this.form.get('email')?.value;
        if (!email) return;
        this.authService.sendOtp(email).subscribe({
            next: () => this.toastService.success('OTP resent! Please check your email.'),
            error: () => this.toastService.error('Failed to resend OTP.')
        });
    }
}
