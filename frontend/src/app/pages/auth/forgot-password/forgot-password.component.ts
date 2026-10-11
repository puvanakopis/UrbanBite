import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-[85vh] bg-canvas flex items-center justify-center px-4 py-16">
      <div class="w-full max-w-[460px] bg-surface border border-neutral-800 rounded p-8 sm:p-11 shadow-2xl">
        <!-- Header -->
        <div class="text-center mb-7">
          <span class="inline-block text-xs font-bold uppercase tracking-[2.5px] text-gold mb-2">ACCOUNT RECOVERY</span>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-white mb-2">{{ step === 1 ? 'Forgot Password' : 'Reset Password' }}</h1>
          <p class="text-xs sm:text-sm text-neutral-400 leading-relaxed">
            {{ step === 1 ? 'Enter your registered email to receive a recovery OTP code.' : 'Enter the code sent to your email and select your new password.' }}
          </p>
        </div>

        <!-- STEP 1: ENTER EMAIL -->
        <form *ngIf="step === 1" (submit)="requestRecoveryOtp($event)" class="space-y-5">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Email Address</label>
            <input 
              type="email" 
              [(ngModel)]="email" 
              name="email" 
              required 
              placeholder="alexander@example.com" 
              class="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded text-white text-sm outline-none focus:border-gold transition-colors placeholder-neutral-600" />
          </div>

          <div *ngIf="errorMessage" class="p-3 bg-red-950/40 border border-red-500/40 text-red-400 text-xs rounded flex items-center gap-2">
            <i class="fa-solid fa-circle-exclamation"></i> {{ errorMessage }}
          </div>

          <button 
            type="submit" 
            class="w-full py-3.5 px-6 bg-white text-black font-bold text-xs uppercase tracking-wider rounded hover:bg-neutral-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md" 
            [disabled]="loading">
            {{ loading ? 'SENDING RECOVERY CODE...' : 'SEND RESET OTP' }}
          </button>
        </form>

        <!-- STEP 2: ENTER OTP & NEW PASSWORD -->
        <form *ngIf="step === 2" (submit)="resetPassword($event)" class="space-y-5">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">6-Digit Recovery OTP</label>
            <input 
              type="text" 
              [(ngModel)]="otpCode" 
              name="otp" 
              maxlength="6" 
              required 
              placeholder="••••••" 
              class="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded text-center text-xl font-bold tracking-widest text-white outline-none focus:border-gold transition-colors placeholder-neutral-600" />
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">New Password</label>
            <div class="relative">
              <input 
                [type]="showNewPassword ? 'text' : 'password'" 
                [(ngModel)]="newPassword" 
                name="newPassword" 
                required 
                minlength="6" 
                placeholder="••••••••" 
                class="w-full pl-4 pr-11 py-3 bg-neutral-900 border border-neutral-700 rounded text-white text-sm outline-none focus:border-gold transition-colors placeholder-neutral-600" />
              <button 
                type="button" 
                (click)="showNewPassword = !showNewPassword"
                class="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors p-1 flex items-center justify-center focus:outline-none"
                [attr.aria-label]="showNewPassword ? 'Hide password' : 'Show password'"
                [title]="showNewPassword ? 'Hide password' : 'Show password'">
                <i [class]="showNewPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
              </button>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Confirm New Password</label>
            <div class="relative">
              <input 
                [type]="showConfirmPassword ? 'text' : 'password'" 
                [(ngModel)]="confirmPassword" 
                name="confirmPassword" 
                required 
                minlength="6" 
                placeholder="••••••••" 
                class="w-full pl-4 pr-11 py-3 bg-neutral-900 border border-neutral-700 rounded text-white text-sm outline-none focus:border-gold transition-colors placeholder-neutral-600" />
              <button 
                type="button" 
                (click)="showConfirmPassword = !showConfirmPassword"
                class="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors p-1 flex items-center justify-center focus:outline-none"
                [attr.aria-label]="showConfirmPassword ? 'Hide password' : 'Show password'"
                [title]="showConfirmPassword ? 'Hide password' : 'Show password'">
                <i [class]="showConfirmPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
              </button>
            </div>
          </div>

          <div *ngIf="errorMessage" class="p-3 bg-red-950/40 border border-red-500/40 text-red-400 text-xs rounded flex items-center gap-2">
            <i class="fa-solid fa-circle-exclamation"></i> {{ errorMessage }}
          </div>

          <div *ngIf="successMessage" class="p-3 bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 text-xs rounded flex items-center gap-2">
            <i class="fa-solid fa-circle-check"></i> {{ successMessage }}
          </div>

          <button 
            type="submit" 
            class="w-full py-3.5 px-6 bg-white text-black font-bold text-xs uppercase tracking-wider rounded hover:bg-neutral-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md" 
            [disabled]="loading">
            {{ loading ? 'UPDATING PASSWORD...' : 'RESET PASSWORD & SIGN IN' }}
          </button>
        </form>

        <div class="text-center mt-7 pt-5 border-t border-neutral-800">
          <a routerLink="/login" class="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors">
            <i class="fa-solid fa-arrow-left"></i> Back to Sign In
          </a>
        </div>
      </div>
    </div>
  `
})
export class ForgotPasswordComponent {
  step: number = 1;
  email: string = '';
  otpCode: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  requestRecoveryOtp(event: Event): void {
    event.preventDefault();
    if (!this.email) return;

    this.loading = true;
    this.errorMessage = '';

    this.authService.forgotPassword(this.email.trim()).subscribe({
      next: res => {
        this.loading = false;
        if (res.success) {
          this.step = 2;
        } else {
          this.errorMessage = res.message || 'Could not process request.';
        }
      },
      error: () => {
        this.loading = false;
        this.step = 2; // proceed to enter code
      }
    });
  }

  resetPassword(event: Event): void {
    event.preventDefault();
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.resetPassword({
      email: this.email.trim(),
      otp: this.otpCode.trim(),
      newPassword: this.newPassword
    }).subscribe({
      next: res => {
        this.loading = false;
        if (res.success) {
          this.successMessage = 'Password successfully updated! Redirecting to login...';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        } else {
          this.errorMessage = res.message || 'Reset failed.';
        }
      },
      error: err => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Invalid or expired code.';
      }
    });
  }
}
