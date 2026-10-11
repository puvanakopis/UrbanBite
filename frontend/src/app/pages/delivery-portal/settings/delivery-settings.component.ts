import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/auth.models';

@Component({
  selector: 'app-delivery-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="bg-[#090909] min-h-[90vh] py-12 sm:py-16 text-neutral-200">
      <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Customer-Style Page Header (Matching Restaurant Settings) -->
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-4 border-b border-[#242424]">
          <div>
            <span class="text-xs font-bold uppercase tracking-[2.5px] text-gold mb-2 block">
              COURIER CREDENTIALS & EQUIPMENT
            </span>
            <div class="flex items-center gap-3">
              <h1 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Profile & Settings
              </h1>
              <span class="px-2.5 py-1 text-[10px] font-bold tracking-wider rounded uppercase flex items-center gap-1.5"
                    [ngClass]="isOnline ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-400' : 'bg-rose-950/60 border border-rose-500/40 text-rose-400'">
                <span class="inline-block w-1.5 h-1.5 rounded-full mr-1" [ngClass]="isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'"></span>
                {{ isOnline ? 'Online for Orders' : 'Shift Offline' }}
              </span>
            </div>
          </div>

          <!-- Header Actions (Matching Restaurant Settings Header Actions) -->
          <div class="flex items-center gap-3">
            <button 
              type="button"
              (click)="isOnline = !isOnline" 
              class="px-4 py-2 border rounded font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2"
              [ngClass]="isOnline ? 'border-[#333] text-neutral-300 hover:border-white hover:bg-white/5' : 'bg-gold hover:bg-gold-light text-black border-gold'">
              <span class="w-2 h-2 rounded-full" [ngClass]="isOnline ? 'bg-emerald-400 shadow-[0_0_8px_#38b000]' : 'bg-rose-500'"></span>
              <span>{{ isOnline ? 'Close Shift' : 'Open Shift' }}</span>
            </button>

            <button 
              type="button"
              (click)="saveProfile()" 
              [disabled]="saving"
              class="px-5 py-2.5 bg-gold hover:bg-gold-light text-black font-extrabold text-xs uppercase tracking-wider rounded transition-all cursor-pointer shadow-md flex items-center gap-2 disabled:opacity-50">
              <i class="fa-solid fa-floppy-disk"></i>
              <span>{{ saving ? 'Saving...' : 'Save Settings' }}</span>
            </button>
          </div>
        </div>

        <!-- Main Form & Live Preview Grid (Matching Restaurant Settings Grid) -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 items-start">
          
          <!-- Column 1 & 2: Main Settings Form (2 cols) -->
          <div class="lg:col-span-2 bg-[#141414] border border-[#242424] rounded p-6 sm:p-8 shadow-xl">
            <div class="mb-6 pb-4 border-b border-[#242424]">
              <span class="text-xs font-bold uppercase tracking-[2px] text-gold block mb-1">COURIER IDENTITY</span>
              <h3 class="text-lg font-bold text-white flex items-center gap-2">
                <i class="fa-solid fa-id-card text-gold text-xs"></i> Personal & Fleet Credentials Configuration
              </h3>
            </div>

            <!-- Success Alert (Matching Restaurant Settings Success Alert) -->
            <div *ngIf="successMessage" class="mb-6 p-4 bg-emerald-950/60 border border-emerald-500/40 rounded text-emerald-400 text-xs flex items-center gap-2.5 animate-fadeIn">
              <i class="fa-solid fa-circle-check text-sm"></i>
              <span class="font-bold">{{ successMessage }}</span>
            </div>

            <form (submit)="saveProfile($event)" class="space-y-6">
              <!-- Name & Phone -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Courier Full Name *</label>
                  <input type="text" [(ngModel)]="fullName" name="fullName" required class="w-full px-4 py-2.5 bg-[#0d0d0d] border border-[#242424] rounded text-white text-xs outline-none focus:border-gold transition-colors placeholder:text-neutral-600" />
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Direct Contact Phone *</label>
                  <input type="text" [(ngModel)]="phone" name="phone" placeholder="+1 (555) 019-7722" class="w-full px-4 py-2.5 bg-[#0d0d0d] border border-[#242424] rounded text-white text-xs outline-none focus:border-gold transition-colors placeholder:text-neutral-600" />
                </div>
              </div>

              <!-- Email (Read Only) -->
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Verified Account Email</label>
                <input type="email" [value]="currentUser?.email || ''" disabled class="w-full px-4 py-2.5 bg-[#080808] border border-[#202020] rounded text-neutral-400 text-xs outline-none cursor-not-allowed" />
                <p class="text-[11px] text-neutral-500 mt-1">Authentication identity verified by UrbanBite Central Administration.</p>
              </div>

              <!-- Primary Vehicle Selector -->
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Primary Fleet Vehicle Type</label>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button type="button" 
                          (click)="vehicleType = 'Motorcycle'"
                          [ngClass]="vehicleType === 'Motorcycle' ? 'bg-[#1e1910] border-gold text-gold font-bold' : 'bg-[#0d0d0d] border-[#242424] text-neutral-400 hover:text-white'"
                          class="p-3 rounded border text-center transition-all cursor-pointer">
                    <i class="fa-solid fa-motorcycle text-lg mb-1 block"></i>
                    <span class="text-xs">Motorcycle</span>
                  </button>

                  <button type="button" 
                          (click)="vehicleType = 'Scooter'"
                          [ngClass]="vehicleType === 'Scooter' ? 'bg-[#1e1910] border-gold text-gold font-bold' : 'bg-[#0d0d0d] border-[#242424] text-neutral-400 hover:text-white'"
                          class="p-3 rounded border text-center transition-all cursor-pointer">
                    <i class="fa-solid fa-moped text-lg mb-1 block"></i>
                    <span class="text-xs">E-Scooter</span>
                  </button>

                  <button type="button" 
                          (click)="vehicleType = 'Bicycle'"
                          [ngClass]="vehicleType === 'Bicycle' ? 'bg-[#1e1910] border-gold text-gold font-bold' : 'bg-[#0d0d0d] border-[#242424] text-neutral-400 hover:text-white'"
                          class="p-3 rounded border text-center transition-all cursor-pointer">
                    <i class="fa-solid fa-bicycle text-lg mb-1 block"></i>
                    <span class="text-xs">Bicycle</span>
                  </button>

                  <button type="button" 
                          (click)="vehicleType = 'Car'"
                          [ngClass]="vehicleType === 'Car' ? 'bg-[#1e1910] border-gold text-gold font-bold' : 'bg-[#0d0d0d] border-[#242424] text-neutral-400 hover:text-white'"
                          class="p-3 rounded border text-center transition-all cursor-pointer">
                    <i class="fa-solid fa-car text-lg mb-1 block"></i>
                    <span class="text-xs">Automobile</span>
                  </button>
                </div>
              </div>

              <!-- Vehicle Model & License ID -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Vehicle Make & Model</label>
                  <input type="text" [(ngModel)]="vehicleModel" name="vehicleModel" placeholder="e.g. Vespa Primavera 150" class="w-full px-4 py-2.5 bg-[#0d0d0d] border border-[#242424] rounded text-white text-xs outline-none focus:border-gold transition-colors placeholder:text-neutral-600" />
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">License Plate / Transit Badge ID</label>
                  <input type="text" [(ngModel)]="licensePlate" name="licensePlate" placeholder="e.g. NY-9942-UB" class="w-full px-4 py-2.5 bg-[#0d0d0d] border border-[#242424] rounded text-white text-xs outline-none focus:border-gold transition-colors placeholder:text-neutral-600" />
                </div>
              </div>

              <!-- Operating Zone Selector -->
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Primary Dispatch Territory</label>
                <div class="relative">
                  <select [(ngModel)]="preferredZone" name="preferredZone" class="w-full px-4 py-2.5 bg-[#0d0d0d] border border-[#242424] rounded text-white text-xs outline-none focus:border-gold transition-colors appearance-none cursor-pointer">
                    <option value="Downtown & SoHo (Priority Zone)">Downtown & SoHo (Priority Zone)</option>
                    <option value="Midtown Manhattan">Midtown Manhattan</option>
                    <option value="Brooklyn Heights & DUMBO">Brooklyn Heights & DUMBO</option>
                    <option value="All Metropolitan Boroughs">All Metropolitan Boroughs</option>
                  </select>
                  <div class="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-[10px] pointer-events-none">
                    <i class="fa-solid fa-chevron-down"></i>
                  </div>
                </div>
              </div>

              <!-- Shift Reception Box (Matching Kitchen Status Box in Restaurant Settings) -->
              <div class="p-5 bg-[#0d0d0d] border border-[#242424] rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span class="block text-xs font-bold text-white uppercase tracking-wider">Shift Dispatch Availability</span>
                  <p class="text-[11px] text-neutral-400 mt-0.5">Control whether customer orders can be dispatched to your courier device right now</p>
                </div>
                <button 
                  type="button"
                  (click)="isOnline = !isOnline"
                  class="px-4 py-2 border rounded font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap"
                  [ngClass]="isOnline ? 'border-[#333] text-neutral-300 hover:border-white hover:bg-white/5' : 'bg-gold hover:bg-gold-light text-black border-gold'">
                  <span class="w-2 h-2 rounded-full" [ngClass]="isOnline ? 'bg-emerald-400 shadow-[0_0_8px_#38b000]' : 'bg-rose-500'"></span>
                  <span>{{ isOnline ? 'Shift Active (Online)' : 'Shift Closed (Offline)' }}</span>
                </button>
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

          <!-- Column 3: Live Courier Identity Card (Matching Restaurant Storefront Live Preview) -->
          <div class="space-y-6">
            <div class="sticky top-28 bg-[#141414] border border-[#242424] rounded p-6 shadow-2xl">
              <span class="text-[10px] font-extrabold uppercase tracking-[2px] text-gold block mb-4">
                COURIER CREDENTIALS PREVIEW
              </span>

              <div class="p-6 rounded bg-[#0d0d0d] border border-[#242424] text-center mb-6">
                <div class="w-20 h-20 rounded-full bg-gradient-to-br from-gold via-amber-400 to-amber-600 p-0.5 mx-auto mb-4 shadow-xl">
                  <div class="w-full h-full bg-[#111] rounded-full flex items-center justify-center">
                    <span class="text-2xl font-extrabold text-gold font-serif">
                      {{ userInitials }}
                    </span>
                  </div>
                </div>

                <h4 class="text-base font-extrabold text-white truncate">{{ fullName || 'Courier Partner' }}</h4>
                <p class="text-xs text-neutral-400 mt-0.5">{{ currentUser?.email || 'courier@urbanbite.com' }}</p>

                <div class="mt-3 flex items-center justify-center gap-2">
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-gold/15 text-gold border border-gold/30">
                    <i class="fa-solid fa-motorcycle mr-1 text-[9px]"></i> {{ vehicleType }}
                  </span>
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                    ★ 4.96 Rating
                  </span>
                </div>
              </div>

              <div class="space-y-3 text-xs border-t border-[#242424] pt-4">
                <div class="flex justify-between">
                  <span class="text-neutral-400">Operating Vehicle:</span>
                  <strong class="text-white">{{ vehicleModel || 'Vespa 150' }}</strong>
                </div>
                <div class="flex justify-between">
                  <span class="text-neutral-400">Transit Badge ID:</span>
                  <strong class="text-white font-mono">{{ licensePlate || 'NY-9942-UB' }}</strong>
                </div>
                <div class="flex justify-between">
                  <span class="text-neutral-400">Assigned Territory:</span>
                  <strong class="text-white truncate max-w-[150px]">{{ preferredZone }}</strong>
                </div>
                <div class="flex justify-between">
                  <span class="text-neutral-400">Insulated Catering Box:</span>
                  <strong class="text-emerald-400">Verified & Approved</strong>
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
export class DeliverySettingsComponent implements OnInit {
  currentUser: User | null = null;
  isOnline: boolean = true;
  fullName: string = '';
  phone: string = '+1 (555) 019-7722';
  vehicleType: string = 'Motorcycle';
  vehicleModel: string = 'Vespa Primavera 150';
  licensePlate: string = 'NY-9942-UB';
  preferredZone: string = 'Downtown & SoHo (Priority Zone)';
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
    if (!this.fullName) return 'D';
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
      this.successMessage = 'Settings saved successfully! Changes are live on the dispatch network.';
      setTimeout(() => {
        this.successMessage = '';
      }, 5000);
    }, 600);
  }
}

// Backwards-compatible export
export { DeliverySettingsComponent as DeliveryProfileComponent };
