import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/auth.models';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="bg-[#090909] min-h-[90vh] py-12 sm:py-16 text-neutral-200">
      <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <!-- Executive Page Header -->
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-4 border-b border-[#242424]">
          <div>
            <span class="text-xs font-bold uppercase tracking-[2.5px] text-gold mb-2 block">
              EXECUTIVE CREDENTIALS & SECURITY
            </span>
            <div class="flex items-center gap-3">
              <h1 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Admin Profile
              </h1>
              <span class="px-2.5 py-1 text-[10px] font-bold tracking-wider rounded uppercase bg-emerald-950/60 border border-emerald-500/40 text-emerald-400">
                <span class="inline-block w-1.5 h-1.5 rounded-full mr-1 bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]"></span>
                Executive Clearance Active
              </span>
            </div>
          </div>

          <!-- Header Actions -->
          <div class="flex items-center gap-3">
            <a 
              routerLink="/admin-portal/dashboard" 
              class="px-4 py-2 border border-neutral-700 hover:border-white text-neutral-300 hover:text-white rounded text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2">
              <i class="fa-solid fa-chart-pie"></i>
              <span>Dashboard</span>
            </a>

            <button 
              type="button"
              (click)="saveProfile()" 
              [disabled]="saving"
              class="px-5 py-2.5 bg-gold hover:bg-gold-light text-black font-extrabold text-xs uppercase tracking-wider rounded transition-all cursor-pointer shadow-md flex items-center gap-2 disabled:opacity-50">
              <i class="fa-solid fa-floppy-disk"></i>
              <span>{{ saving ? 'Saving...' : 'Save Profile' }}</span>
            </button>
          </div>
        </div>

        <!-- Main Form & Live Preview Grid (Matching Restaurant & Delivery Settings Layout) -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 items-start">
          
          <!-- Column 1 & 2: Settings Form -->
          <div class="lg:col-span-2 bg-[#141414] border border-[#242424] rounded p-6 sm:p-8 shadow-xl">
            <div class="mb-6 pb-4 border-b border-[#242424]">
              <span class="text-xs font-bold uppercase tracking-[2px] text-gold block mb-1">ADMINISTRATIVE IDENTITY</span>
              <h3 class="text-lg font-bold text-white flex items-center gap-2">
                <i class="fa-solid fa-shield-halved text-gold text-xs"></i> Super Administrator Information & Access Controls
              </h3>
            </div>

            <!-- Success Alert -->
            <div *ngIf="successMessage" class="mb-6 p-4 bg-emerald-950/60 border border-emerald-500/40 rounded text-emerald-400 text-xs flex items-center gap-2.5 animate-fadeIn">
              <i class="fa-solid fa-circle-check text-sm"></i>
              <span class="font-bold">{{ successMessage }}</span>
            </div>

            <form (submit)="saveProfile($event)" class="space-y-6">
              
              <!-- Name & Phone -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Administrator Full Name *</label>
                  <input type="text" [(ngModel)]="fullName" name="fullName" required class="w-full px-4 py-2.5 bg-[#0d0d0d] border border-[#242424] rounded text-white text-xs outline-none focus:border-gold transition-colors placeholder:text-neutral-600" />
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Emergency Phone Contact *</label>
                  <input type="text" [(ngModel)]="phone" name="phone" placeholder="+1 (555) 992-0044" class="w-full px-4 py-2.5 bg-[#0d0d0d] border border-[#242424] rounded text-white text-xs outline-none focus:border-gold transition-colors placeholder:text-neutral-600" />
                </div>
              </div>

              <!-- Email & Security Role -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Executive Account Email</label>
                  <input type="email" [value]="currentUser?.email || ''" disabled class="w-full px-4 py-2.5 bg-[#080808] border border-[#202020] rounded text-neutral-400 text-xs outline-none cursor-not-allowed" />
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Authorization Role</label>
                  <div class="w-full px-4 py-2.5 bg-[#080808] border border-[#202020] rounded text-gold text-xs font-bold flex items-center justify-between">
                    <span>ROLE_ADMIN</span>
                    <span class="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">Executive Clearance</span>
                  </div>
                </div>
              </div>

              <!-- System Security Protocol Flags -->
              <div class="space-y-3 pt-4 border-t border-[#242424]">
                <span class="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">Governance Preferences</span>

                <!-- Flag 1 -->
                <div class="p-4 bg-[#0d0d0d] border border-[#242424] rounded flex items-center justify-between">
                  <div>
                    <strong class="text-white text-xs block">Audit Logging Surveillance</strong>
                    <span class="text-neutral-500 text-[11px]">Record every moderation action in platform audit journal</span>
                  </div>
                  <span class="px-2.5 py-1 rounded text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                    Enforced
                  </span>
                </div>

                <!-- Flag 2 -->
                <div class="p-4 bg-[#0d0d0d] border border-[#242424] rounded flex items-center justify-between">
                  <div>
                    <strong class="text-white text-xs block">High-Value Transaction Alerts</strong>
                    <span class="text-neutral-500 text-[11px]">Push instant notifications on orders exceeding &#36;200</span>
                  </div>
                  <span class="px-2.5 py-1 rounded text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                    Active
                  </span>
                </div>

                <!-- Flag 3 -->
                <div class="p-4 bg-[#0d0d0d] border border-[#242424] rounded flex items-center justify-between">
                  <div>
                    <strong class="text-white text-xs block">Two-Factor Authentication (OTP)</strong>
                    <span class="text-neutral-500 text-[11px]">Required for executive portal access</span>
                  </div>
                  <span class="px-2.5 py-1 rounded text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                    Verified
                  </span>
                </div>
              </div>

              <div class="pt-4 border-t border-[#242424] flex justify-end">
                <button type="submit" 
                        [disabled]="saving"
                        class="px-6 py-2.5 bg-gold hover:bg-gold-light text-black font-extrabold text-xs uppercase tracking-wider rounded transition-all cursor-pointer shadow-md inline-flex items-center gap-2 disabled:opacity-50">
                  <i class="fa-solid fa-floppy-disk"></i>
                  <span>{{ saving ? 'Saving Changes...' : 'Save Profile Changes' }}</span>
                </button>
              </div>
            </form>
          </div>

          <!-- Column 3: Live Identity Card -->
          <div class="space-y-6">
            <div class="sticky top-28 bg-[#141414] border border-[#242424] rounded p-6 shadow-2xl">
              <span class="text-[10px] font-extrabold uppercase tracking-[2px] text-gold block mb-4">
                EXECUTIVE CLEARANCE BADGE
              </span>

              <div class="p-6 rounded bg-[#0d0d0d] border border-[#242424] text-center mb-6">
                <div class="w-20 h-20 rounded-full bg-gradient-to-br from-gold via-amber-400 to-amber-600 p-0.5 mx-auto mb-4 shadow-xl">
                  <div class="w-full h-full bg-[#111] rounded-full flex items-center justify-center">
                    <span class="text-2xl font-extrabold text-gold font-serif">
                      {{ userInitials }}
                    </span>
                  </div>
                </div>

                <h4 class="text-base font-extrabold text-white truncate">{{ fullName || 'Administrator' }}</h4>
                <p class="text-xs text-neutral-400 mt-0.5">{{ currentUser?.email || 'admin@urbanbite.com' }}</p>

                <div class="mt-3 flex items-center justify-center gap-2">
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-gold/15 text-gold border border-gold/30">
                    <i class="fa-solid fa-shield-halved mr-1 text-[9px]"></i> Super Admin
                  </span>
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                    Root Authority
                  </span>
                </div>
              </div>

              <div class="space-y-3 text-xs border-t border-[#242424] pt-4">
                <span class="text-neutral-400 uppercase font-bold text-[10px] block mb-2">Granted Privileges</span>
                
                <div class="flex items-center gap-2 text-neutral-300">
                  <i class="fa-solid fa-check text-emerald-400 text-[10px]"></i>
                  <span>Platform Catalog Moderation</span>
                </div>
                <div class="flex items-center gap-2 text-neutral-300">
                  <i class="fa-solid fa-check text-emerald-400 text-[10px]"></i>
                  <span>Restaurant Onboarding Approval</span>
                </div>
                <div class="flex items-center gap-2 text-neutral-300">
                  <i class="fa-solid fa-check text-emerald-400 text-[10px]"></i>
                  <span>User Account Revocation & Suspension</span>
                </div>
                <div class="flex items-center gap-2 text-neutral-300">
                  <i class="fa-solid fa-check text-emerald-400 text-[10px]"></i>
                  <span>Financial Volume Ledger Surveillance</span>
                </div>
              </div>

              <div class="mt-6 pt-4 border-t border-[#242424]">
                <button type="button" 
                        (click)="saveProfile()" 
                        [disabled]="saving"
                        class="w-full py-2.5 bg-gold hover:bg-gold-light text-black font-extrabold text-xs uppercase tracking-wider rounded transition-all cursor-pointer shadow-md flex items-center justify-center gap-2">
                  <i class="fa-solid fa-check"></i>
                  <span>{{ saving ? 'Saving...' : 'Confirm Details' }}</span>
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  `
})
export class AdminProfileComponent implements OnInit {
  currentUser: User | null = null;
  fullName: string = '';
  phone: string = '+1 (555) 992-0044';
  saving: boolean = false;
  successMessage: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    if (this.currentUser) {
      this.fullName = this.currentUser.fullName || '';
      if (this.currentUser.phone) {
        this.phone = this.currentUser.phone;
      }
    }
  }

  get userInitials(): string {
    if (!this.fullName) return 'A';
    return this.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  saveProfile(e?: Event): void {
    if (e) e.preventDefault();
    this.saving = true;
    this.successMessage = '';

    setTimeout(() => {
      this.saving = false;
      this.authService.updateLocalProfile({
        fullName: this.fullName,
        phone: this.phone
      });
      this.successMessage = 'Admin credentials updated successfully.';
      setTimeout(() => {
        this.successMessage = '';
      }, 5000);
    }, 600);
  }
}
