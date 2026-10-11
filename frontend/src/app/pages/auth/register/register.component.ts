import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Role } from '../../../models/auth.models';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-[85vh] bg-canvas flex items-center justify-center px-4 py-16">
      <div class="w-full max-w-[620px] bg-surface border border-neutral-800 rounded p-8 sm:p-11 shadow-2xl">
        <!-- Header -->
        <div class="text-center mb-7">
          <span class="inline-block text-xs font-bold uppercase tracking-[2.5px] text-gold mb-2">CREATE ACCOUNT</span>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-white mb-2">Join UrbanBite</h1>
          <p class="text-xs sm:text-sm text-neutral-400 leading-relaxed">Register to explore artisanal dishes, onboard your restaurant, or deliver as a courier.</p>
        </div>

        <form (submit)="onSubmit($event)" class="space-y-4">
          <!-- Role Selector -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            <label 
              class="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2 p-3.5 rounded border cursor-pointer transition-all"
              [ngClass]="selectedRole === 'ROLE_CUSTOMER' ? 'border-gold bg-[#1c1810]' : 'border-neutral-800 bg-neutral-900/80 hover:border-neutral-700'">
              <div class="flex items-center justify-between w-full">
                <span class="text-xs sm:text-sm text-white font-bold block flex items-center gap-1.5">
                  <i class="fa-solid fa-user text-gold text-xs"></i> Customer
                </span>
                <input type="radio" name="role" value="ROLE_CUSTOMER" [(ngModel)]="selectedRole" class="accent-gold" />
              </div>
              <small class="text-[10px] text-neutral-400">Order dining & delivery</small>
            </label>

            <label 
              class="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2 p-3.5 rounded border cursor-pointer transition-all"
              [ngClass]="selectedRole === 'ROLE_RESTAURANT_OWNER' ? 'border-gold bg-[#1c1810]' : 'border-neutral-800 bg-neutral-900/80 hover:border-neutral-700'">
              <div class="flex items-center justify-between w-full">
                <span class="text-xs sm:text-sm text-white font-bold block flex items-center gap-1.5">
                  <i class="fa-solid fa-store text-gold text-xs"></i> Restaurant
                </span>
                <input type="radio" name="role" value="ROLE_RESTAURANT_OWNER" [(ngModel)]="selectedRole" class="accent-gold" />
              </div>
              <small class="text-[10px] text-neutral-400">Kitchen & menu hub</small>
            </label>

            <label 
              class="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2 p-3.5 rounded border cursor-pointer transition-all"
              [ngClass]="selectedRole === 'ROLE_DELIVERY_PARTNER' ? 'border-gold bg-[#1c1810]' : 'border-neutral-800 bg-neutral-900/80 hover:border-neutral-700'">
              <div class="flex items-center justify-between w-full">
                <span class="text-xs sm:text-sm text-white font-bold block flex items-center gap-1.5">
                  <i class="fa-solid fa-motorcycle text-gold text-xs"></i> Delivery
                </span>
                <input type="radio" name="role" value="ROLE_DELIVERY_PARTNER" [(ngModel)]="selectedRole" class="accent-gold" />
              </div>
              <small class="text-[10px] text-neutral-400">Courier tasks & payouts</small>
            </label>
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
              {{ selectedRole === 'ROLE_RESTAURANT_OWNER' ? 'Restaurant / Owner Name' : (selectedRole === 'ROLE_DELIVERY_PARTNER' ? 'Courier Legal Name' : 'Full Name') }}
            </label>
            <input 
              type="text" 
              [(ngModel)]="fullName" 
              name="fullName" 
              required 
              [placeholder]="selectedRole === 'ROLE_DELIVERY_PARTNER' ? 'e.g. Marcus Vance' : (selectedRole === 'ROLE_RESTAURANT_OWNER' ? 'e.g. Bistro Bella Vista' : 'e.g. Alexander Wright')" 
              class="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded text-white text-sm outline-none focus:border-gold transition-colors placeholder-neutral-600" />
          </div>

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

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Phone Number (Optional)</label>
            <input 
              type="tel" 
              [(ngModel)]="phone" 
              name="phone" 
              placeholder="+1 (555) 019-2831" 
              class="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded text-white text-sm outline-none focus:border-gold transition-colors placeholder-neutral-600" />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Password</label>
              <div class="relative">
                <input 
                  [type]="showPassword ? 'text' : 'password'" 
                  [(ngModel)]="password" 
                  name="password" 
                  required 
                  minlength="6" 
                  placeholder="••••••••" 
                  class="w-full pl-4 pr-11 py-3 bg-neutral-900 border border-neutral-700 rounded text-white text-sm outline-none focus:border-gold transition-colors placeholder-neutral-600" />
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
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Confirm Password</label>
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
          </div>

          <div class="my-5">
            <label class="flex items-center gap-3 text-xs text-neutral-400 cursor-pointer">
              <input type="checkbox" [(ngModel)]="agreeTerms" name="agreeTerms" required class="accent-gold w-4 h-4" />
              <span>I accept UrbanBite's Terms & Conditions and Privacy Policy</span>
            </label>
          </div>

          <div *ngIf="errorMessage" class="p-3 bg-red-950/40 border border-red-500/40 text-red-400 text-xs rounded flex items-center gap-2">
            <i class="fa-solid fa-circle-exclamation"></i> {{ errorMessage }}
          </div>

          <button 
            type="submit" 
            class="w-full py-3.5 px-6 bg-white text-black font-bold text-xs uppercase tracking-wider rounded hover:bg-neutral-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md" 
            [disabled]="loading || !agreeTerms">
            {{ loading ? 'CREATING ACCOUNT...' : (selectedRole === 'ROLE_DELIVERY_PARTNER' ? 'REGISTER AS COURIER (OTP)' : (selectedRole === 'ROLE_RESTAURANT_OWNER' ? 'REGISTER RESTAURANT (OTP)' : 'REGISTER WITH OTP VERIFICATION')) }}
          </button>
        </form>

        <div class="text-center mt-7 pt-5 border-t border-neutral-800 text-xs text-neutral-400">
          <p>Already have an account? <a routerLink="/login" class="text-white font-bold hover:underline ml-1">Sign In</a></p>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  fullName: string = '';
  email: string = '';
  phone: string = '';
  password: string = '';
  confirmPassword: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  selectedRole: Role = 'ROLE_CUSTOMER';
  agreeTerms: boolean = true;

  loading: boolean = false;
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(event: Event): void {
    event.preventDefault();
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const payload = {
      fullName: this.fullName.trim(),
      email: this.email.trim(),
      phone: this.phone.trim() || undefined,
      password: this.password,
      role: this.selectedRole
    };

    this.authService.register(payload).subscribe({
      next: res => {
        this.loading = false;
        if (res.success) {
          this.router.navigate(['/verify-otp'], { 
            queryParams: { email: this.email.trim(), type: 'REGISTRATION' } 
          });
        } else {
          this.errorMessage = res.message || 'Registration failed.';
        }
      },
      error: err => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Server error during registration.';
      }
    });
  }
}
