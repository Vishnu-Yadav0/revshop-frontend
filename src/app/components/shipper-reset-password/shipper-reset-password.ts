import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ShipperService } from '../../services/shipper.service';
import { ToastService } from '../../services/toast';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const pw = control.get('newPassword');
    const confirm = control.get('confirmPassword');
    if (pw && confirm && pw.value !== confirm.value) {
        return { passwordMismatch: true };
    }
    return null;
}

@Component({
    selector: 'app-shipper-reset-password',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './shipper-reset-password.html',
    styleUrl: '../shipper-login/shipper-login.css'
})
export class ShipperResetPasswordComponent implements OnInit {
    form: FormGroup;
    submitted = false;
    loading = false;
    token = '';
    tokenMissing = false;
    resetDone = false;
    showPassword = false;
    showConfirm = false;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private shipperService: ShipperService,
        private toastService: ToastService
    ) {
        this.form = this.fb.group({
            newPassword: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required]
        }, { validators: passwordMatchValidator });
    }

    ngOnInit(): void {
        this.token = this.route.snapshot.queryParamMap.get('token') || '';
        if (!this.token) {
            this.tokenMissing = true;
        }
    }

    get f() { return this.form.controls; }

    onSubmit(): void {
        this.submitted = true;
        if (this.form.invalid || !this.token) return;

        this.loading = true;
        const newPassword = this.form.get('newPassword')!.value;

        this.shipperService.shipperResetPassword(this.token, newPassword).subscribe({
            next: (res) => {
                this.resetDone = true;
                this.loading = false;
                this.toastService.success('Password reset successfully! Please login.');
                setTimeout(() => this.router.navigate(['/shipper-login']), 2000);
            },
            error: (err) => {
                this.loading = false;
                this.toastService.error(err.error?.message || 'Invalid or expired reset link.');
            }
        });
    }
}
