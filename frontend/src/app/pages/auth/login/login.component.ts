import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-[85vh] bg-canvas flex items-center justify-center px-4 py-16">
      <div class="w-full max-w-[460px] bg-surface border border-neutral-800 rounded p-8 sm:p-11 shadow-2xl">
        <!-- Header -->
        <div class="text-center mb-8">
          <span class="inline-block text-xs font-bold uppercase tracking-[2.5px] text-gold mb-2">ACCESS PORTAL</span>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-white mb-2">Welcome Back</h1>
          <p class="text-xs sm:text-sm text-neutral-400 leading-relaxed">Sign in to your UrbanBite account to access orders, menus, or dispatch consoles.</p>
        </div>

        <form (submit)="onSubmit($event)" class="space-y-5">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Email Address</label>
            <input 
              type="email" 
              [(ngModel)]="email" 
              name="email" 
              placeholder="alexander@example.com" 
              required 
              class="w-full px-4 py-3.5 bg-neutral-900 border border-neutral-700 rounded text-white text-sm outline-none focus:border-gold transition-colors placeholder-neutral-600" />
          </div>

          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="text-xs font-bold uppercase tracking-wider text-neutral-400">Password</label>
              <a routerLink="/forgot-password" class="text-xs text-gold hover:underline">Forgot Password?</a>
            </div>
            <div class="relative">
              <input 
                [type]="showPassword ? 'text' : 'password'" 
                [(ngModel)]="password" 
                name="password" 
                placeholder="••••••••" 
                required 
                class="w-full pl-4 pr-11 py-3.5 bg-neutral-900 border border-neutral-700 rounded text-white text-sm outline-none focus:border-gold transition-colors placeholder-neutral-600" />
              <button 
                type="button" 
                (click)="showPassword = !showPassword"
                class="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors p-1 flex items-center justify-center focus:outline-none"
                [attr.aria-label]="showPassword ? 'Hide password' : 'Show password'"
                [title]="showPassword ? 'Hide password' : 'Show password'">
                <i [class]="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
              </button>
            </div>
          </div>

          <div *ngIf="errorMessage" class="p-3 bg-red-950/40 border border-red-500/40 text-red-400 text-xs rounded flex items-center gap-2">
            <i class="fa-solid fa-circle-exclamation"></i> {{ errorMessage }}
          </div>

          <button 
            type="submit" 
            class="w-full py-3.5 px-6 bg-white text-black font-bold text-xs uppercase tracking-wider rounded hover:bg-neutral-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md cursor-pointer"
            [disabled]="loading">
            {{ loading ? 'AUTHENTICATING...' : 'SIGN IN' }}
          </button>
        </form>

        <div class="text-center mt-7 pt-5 border-t border-neutral-800 text-xs text-neutral-400">
          <p>Don't have an account yet? <a routerLink="/register" class="text-white font-bold hover:underline ml-1">Create Account</a></p>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  loading: boolean = false;
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(event: Event): void {
    event.preventDefault();
    if (!this.email || !this.password) return;

    this.loading = true;
    this.errorMessage = '';

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: res => {
        this.loading = false;
        if (res.success && res.data) {
          this.redirectByRole(res.data.role);
        } else {
          this.errorMessage = res.message || 'Invalid credentials.';
          if (res.message && res.message.includes('not verified')) {
            this.router.navigate(['/verify-otp'], { queryParams: { email: this.email } });
          }
        }
      },
      error: err => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Login attempt failed. Please check credentials.';
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
