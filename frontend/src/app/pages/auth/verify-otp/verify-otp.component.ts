import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-[85vh] bg-canvas flex items-center justify-center px-4 py-16">
      <div class="w-full max-w-[460px] bg-surface border border-neutral-800 rounded p-8 sm:p-11 shadow-2xl text-center">
        <!-- Header -->
        <div class="mb-8">
          <div class="w-14 h-14 rounded-full bg-gold/15 border border-gold/30 text-gold text-2xl flex items-center justify-center mx-auto mb-5">
            <i class="fa-regular fa-envelope-open"></i>
          </div>
          <span class="inline-block text-xs font-bold uppercase tracking-[2.5px] text-gold mb-2">SECURITY VERIFICATION</span>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-white mb-2">Verify Email OTP</h1>
          <p class="text-xs sm:text-sm text-neutral-400 leading-relaxed">
            We have dispatched a time-sensitive 6-digit verification code to:<br>
            <strong class="text-white">{{ email }}</strong>
          </p>
        </div>

        <!-- Form -->
        <form (submit)="onSubmit($event)" class="space-y-5">
          <div>
            <input 
              type="text" 
              [(ngModel)]="otpCode" 
              name="otp" 
              maxlength="6" 
              placeholder="••••••" 
              required 
              class="w-full h-16 bg-neutral-950 border border-neutral-700 rounded text-center text-3xl font-extrabold tracking-[12px] text-white outline-none focus:border-white transition-colors placeholder-neutral-700" />
            <small class="block text-neutral-500 text-xs mt-2">Enter the 6-digit code received via email.</small>
          </div>

          <div *ngIf="errorMessage" class="p-3 bg-red-950/40 border border-red-500/40 text-red-400 text-xs rounded flex items-center justify-center gap-2">
            <i class="fa-solid fa-circle-exclamation"></i> {{ errorMessage }}
          </div>

          <div *ngIf="successMessage" class="p-3 bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 text-xs rounded flex items-center justify-center gap-2">
            <i class="fa-solid fa-circle-check"></i> {{ successMessage }}
          </div>

          <button 
            type="submit" 
            class="w-full py-3.5 px-6 bg-white text-black font-bold text-xs uppercase tracking-wider rounded hover:bg-neutral-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
            [disabled]="loading || otpCode.length < 6">
            {{ loading ? 'VERIFYING CODE...' : 'VERIFY & CONTINUE' }}
          </button>
        </form>

        <!-- Resend Code -->
        <div class="mt-7 pt-5 border-t border-neutral-800">
          <p *ngIf="cooldownSeconds > 0" class="text-xs text-neutral-500">
            Resend available in: <strong class="text-white">{{ cooldownSeconds }}s</strong>
          </p>
          <button 
            *ngIf="cooldownSeconds === 0" 
            (click)="resendOtp()" 
            class="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gold hover:underline disabled:opacity-50"
            [disabled]="resending">
            <i class="fa-solid fa-rotate-right"></i> {{ resending ? 'Dispatching...' : 'Resend Verification Code' }}
          </button>
        </div>

        <!-- Footer -->
        <div class="mt-4 pt-4 border-t border-neutral-800">
          <a routerLink="/login" class="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors">
            <i class="fa-solid fa-arrow-left"></i> Return to Sign In
          </a>
        </div>
      </div>
    </div>
  `
})
export class VerifyOtpComponent implements OnInit, OnDestroy {
  email: string = '';
  challengeType: string = 'REGISTRATION';
  otpCode: string = '';

  loading: boolean = false;
  resending: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  cooldownSeconds: number = 60;
  timerInterval: any;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
      this.challengeType = params['type'] || 'REGISTRATION';
      this.startCooldown();
    });
  }

  ngOnDestroy(): void {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  startCooldown(): void {
    this.cooldownSeconds = 60;
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (this.cooldownSeconds > 0) {
        this.cooldownSeconds--;
      } else {
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    if (this.otpCode.length < 6) return;

    this.loading = true;
    this.errorMessage = '';

    this.authService.verifyOtp({
      email: this.email,
      otp: this.otpCode.trim(),
      challengeType: this.challengeType
    }).subscribe({
      next: res => {
        this.loading = false;
        if (res.success && res.data) {
          this.redirectByRole(res.data.role);
        } else {
          this.errorMessage = res.message || 'Verification failed.';
        }
      },
      error: err => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Verification failed. Please check the code.';
      }
    });
  }

  resendOtp(): void {
    this.resending = true;
    this.errorMessage = '';
    this.authService.resendOtp({ email: this.email, challengeType: this.challengeType }).subscribe({
      next: res => {
        this.resending = false;
        if (res.success) {
          this.successMessage = 'A new 6-digit OTP code has been sent!';
          this.startCooldown();
          setTimeout(() => this.successMessage = '', 4000);
        } else {
          this.errorMessage = res.message || 'Could not resend code.';
        }
      },
      error: err => {
        this.resending = false;
        this.errorMessage = err.error?.message || 'Cooldown in progress. Please wait.';
      }
    });
  }

  private redirectByRole(role: string): void {
    switch (role) {
      case 'ROLE_RESTAURANT_OWNER':
        this.router.navigate(['/restaurant-portal']);
        break;
      case 'ROLE_DELIVERY_PARTNER':
        this.router.navigate(['/delivery-portal']);
        break;
      case 'ROLE_ADMIN':
        this.router.navigate(['/admin-portal']);
        break;
      default:
        this.router.navigate(['/']);
        break;
    }
  }
}
