import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { OrderService } from '../../../services/order.service';
import { User } from '../../../models/auth.models';
import { Address } from '../../../models/order.models';
import { UserSidebarComponent } from '../../../components/user-sidebar/user-sidebar.component';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, UserSidebarComponent],
  template: `
    <div class="bg-[#090909] min-h-[90vh] py-12 sm:py-16 text-neutral-200">
      <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <!-- Grid Layout: Sidebar Navigation + Main Account Content -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          <!-- Left Column: User Sidebar Navigation -->
          <div class="lg:col-span-3">
            <app-user-sidebar></app-user-sidebar>
          </div>

          <!-- Right Column: Main Content -->
          <div class="lg:col-span-9 space-y-8">

            <!-- Header -->
            <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2 pb-2">
              <div>
                <span class="text-xs font-bold uppercase tracking-[2.5px] text-gold mb-3 inline-block">ACCOUNT & PROFILE</span>
                <h1 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">My Account Profile</h1>
              </div>
            </div>

          <!-- Card 1: Edit Account Information (Name, Email, Phone) -->
          <div class="bg-[#141414] border border-[#242424] rounded p-6 sm:p-8 shadow-xl">
            <div class="flex items-center justify-between pb-5 border-b border-[#242424] mb-6">
              <div>
                <span class="text-[10px] font-extrabold uppercase tracking-[2px] text-gold block mb-1">PERSONAL PROFILE</span>
                <h3 class="text-xl font-bold text-white">Account Details</h3>
                <p class="text-xs text-neutral-400 mt-1">Manage your legal name, email address, and contact phone number.</p>
              </div>
              <div class="w-14 h-14 rounded bg-gradient-to-br from-gold via-amber-400 to-amber-600 p-0.5 shadow-lg hidden sm:block">
                <div class="w-full h-full bg-[#111] rounded flex items-center justify-center">
                  <span class="text-lg font-extrabold text-gold uppercase tracking-wider">{{ userInitials }}</span>
                </div>
              </div>
            </div>

            <!-- Edit Account Form -->
            <form (submit)="saveProfileChanges($event)" class="space-y-5">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Full Legal Name *</label>
                  <input type="text" 
                         [(ngModel)]="editForm.fullName" 
                         name="fullName" 
                         required 
                         class="w-full px-4 py-3 bg-[#0d0d0d] border border-[#242424] focus:border-gold rounded text-white text-xs outline-none transition-colors" 
                         placeholder="e.g. Eleanor Vance" />
                </div>

                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Registered Email Address *</label>
                  <input type="email" 
                         [(ngModel)]="editForm.email" 
                         name="email" 
                         required 
                         class="w-full px-4 py-3 bg-[#0d0d0d] border border-[#242424] focus:border-gold rounded text-white text-xs outline-none transition-colors" 
                         placeholder="patron@urbanbite.com" />
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Contact Phone Number</label>
                <input type="tel" 
                       [(ngModel)]="editForm.phone" 
                       name="phone" 
                       class="w-full px-4 py-3 bg-[#0d0d0d] border border-[#242424] focus:border-gold rounded text-white text-xs outline-none transition-colors" 
                       placeholder="+1 (555) 019-4400" />
              </div>

              <div *ngIf="editSuccessMsg" class="p-3.5 bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs rounded flex items-center gap-2 animate-fadeIn">
                <i class="fa-solid fa-circle-check"></i>
                <span>{{ editSuccessMsg }}</span>
              </div>

              <div class="pt-2 flex justify-end">
                <button type="submit" 
                        class="px-6 py-2.5 bg-gold hover:bg-gold-light text-black font-extrabold text-xs uppercase tracking-wider rounded transition-all cursor-pointer shadow-md flex items-center gap-2">
                  <i class="fa-solid fa-check"></i>
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>

          <!-- Card 2: Saved Delivery Destinations (Addresses) -->
          <div class="bg-[#141414] border border-[#242424] rounded p-6 sm:p-7 shadow-xl">
            <div class="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#242424] mb-6">
              <div>
                <span class="text-[10px] font-bold uppercase tracking-[2px] text-gold block mb-0.5">DELIVERY DESTINATIONS</span>
                <div class="flex items-center gap-2.5">
                  <h3 class="text-lg font-bold text-white">Saved Residences</h3>
                  <span class="text-[11px] font-mono px-2 py-0.5 rounded bg-[#1e1e1e] border border-[#2d2d2d] text-neutral-300">
                    {{ addresses.length }}
                  </span>
                </div>
              </div>
              <button (click)="openNewAddressModal()" 
                      class="inline-flex items-center gap-2 px-4 py-2 bg-gold hover:bg-gold-light text-black font-extrabold text-xs uppercase tracking-wider rounded transition-all cursor-pointer shadow-md">
                <i class="fa-solid fa-plus text-[10px]"></i>
                <span>Add Address</span>
              </button>
            </div>

            <!-- Empty Addresses State -->
            <div *ngIf="addresses.length === 0" class="text-center py-10 px-4 bg-[#0d0d0d] rounded border border-dashed border-[#242424]">
              <div class="w-14 h-14 rounded bg-[#191919] flex items-center justify-center mx-auto mb-3 text-gold">
                <i class="fa-solid fa-map-location-dot text-xl"></i>
              </div>
              <h4 class="text-sm font-bold text-white mb-1">No Saved Delivery Residences</h4>
              <p class="text-xs text-neutral-400 mb-4 max-w-sm mx-auto">Save your penthouse, loft, or office addresses for one-click express culinary checkout.</p>
              <button (click)="openNewAddressModal()" 
                      class="inline-flex items-center gap-2 px-5 py-2.5 bg-gold hover:bg-gold-light text-black font-extrabold text-xs uppercase tracking-wider rounded transition-all cursor-pointer shadow-md">
                <i class="fa-solid fa-plus text-[10px]"></i>
                <span>Add Your First Address</span>
              </button>
            </div>

            <!-- Addresses List -->
            <div *ngIf="addresses.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div *ngFor="let addr of addresses" 
                   class="bg-[#0f0f0f] border rounded p-4 flex flex-col justify-between transition-all group hover:border-neutral-600 shadow-md relative"
                   [ngClass]="addr.isDefault ? 'border-gold/50 shadow-gold/5 bg-[#12110c]' : 'border-[#222]'">
                
                <div>
                  <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-2">
                      <div class="w-7 h-7 rounded bg-[#1a1a1a] text-gold flex items-center justify-center text-xs border border-[#2a2a2a]">
                        <i class="fa-solid" [ngClass]="getAddressIcon(addr.label)"></i>
                      </div>
                      <span class="text-xs font-extrabold text-white uppercase tracking-wider">{{ addr.label }}</span>
                    </div>
                    <span *ngIf="addr.isDefault" class="text-[9px] font-extrabold bg-gold text-black px-2 py-0.5 rounded uppercase tracking-wider">
                      DEFAULT
                    </span>
                  </div>

                  <div class="space-y-1 text-xs">
                    <p class="font-bold text-white text-xs leading-snug">{{ addr.streetAddress }}</p>
                    <p class="text-[11px] text-neutral-400">{{ addr.city }}{{ addr.postalCode ? ', ' + addr.postalCode : '' }}</p>
                    <p *ngIf="addr.phone" class="text-[11px] text-neutral-400 flex items-center gap-1.5 pt-1">
                      <i class="fa-solid fa-phone text-neutral-500 text-[10px]"></i>
                      {{ addr.phone }}
                    </p>
                    <p *ngIf="addr.deliveryInstructions" class="text-[11px] text-neutral-400 italic pt-1.5 border-t border-[#1c1c1c] mt-2 line-clamp-2">
                      <i class="fa-solid fa-quote-left mr-1 text-gold text-[9px]"></i>
                      {{ addr.deliveryInstructions }}
                    </p>
                  </div>
                </div>

                <div class="pt-3 border-t border-[#1c1c1c] mt-3 flex justify-between items-center text-[10px]">
                  <span class="text-neutral-500 flex items-center gap-1">
                    <i class="fa-solid fa-house-chimney text-neutral-600"></i> Verified destination
                  </span>
                  <button (click)="deleteAddress(addr.id!)" 
                          [disabled]="deletingAddressId === addr.id"
                          class="text-rose-400 hover:text-rose-300 cursor-pointer flex items-center gap-1 py-1 px-2 rounded hover:bg-rose-500/10 transition-colors disabled:opacity-40">
                    <i class="fa-regular fa-trash-can"></i>
                    <span>{{ deletingAddressId === addr.id ? 'Removing...' : 'Remove' }}</span>
                  </button>
                </div>

              </div>
            </div>
          </div>

          <!-- DEDICATED CONCIERGE (Moved to the bottom of the account page) -->
          <div class="bg-[#141414] border border-[#242424] rounded p-6 sm:p-8 shadow-xl">
            <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div class="max-w-xl">
                <span class="text-[10px] font-bold uppercase tracking-[2px] text-gold block mb-1">DEDICATED CONCIERGE</span>
                <h4 class="text-base sm:text-lg font-bold text-white mb-2">Need Bespoke Assistance?</h4>
                <p class="text-xs text-neutral-400 leading-relaxed">
                  Our private culinary support desk is on standby for special dietary requests, large dinner party coordination, and courier logistics.
                </p>
              </div>

              <div class="flex flex-col sm:flex-row gap-3 text-xs shrink-0">
                <a href="tel:+15550194400" class="flex items-center gap-3.5 p-3.5 rounded bg-[#0d0d0d] border border-[#222] text-neutral-300 hover:text-gold hover:border-gold/40 transition-all sm:min-w-[220px]">
                  <div class="w-9 h-9 rounded bg-gold/10 text-gold flex items-center justify-center shrink-0">
                    <i class="fa-solid fa-phone text-xs"></i>
                  </div>
                  <div>
                    <span class="text-[10px] text-neutral-500 block uppercase font-bold tracking-wider">Direct Concierge Line</span>
                    <span class="font-bold text-white">+1 (555) 019-4400</span>
                  </div>
                </a>

                <a href="mailto:concierge@urbanbite.com" class="flex items-center gap-3.5 p-3.5 rounded bg-[#0d0d0d] border border-[#222] text-neutral-300 hover:text-gold hover:border-gold/40 transition-all sm:min-w-[220px]">
                  <div class="w-9 h-9 rounded bg-gold/10 text-gold flex items-center justify-center shrink-0">
                    <i class="fa-regular fa-envelope text-xs"></i>
                  </div>
                  <div>
                    <span class="text-[10px] text-neutral-500 block uppercase font-bold tracking-wider">Priority Inquiries</span>
                    <span class="font-bold text-white">concierge&#64;urbanbite.com</span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          </div>

        </div>

        <!-- NEW ADDRESS MODAL -->
        <div *ngIf="showAddressModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div class="bg-[#141414] border border-[#333] rounded w-full max-w-lg shadow-2xl overflow-hidden">
            <div class="p-6 border-b border-[#242424] flex justify-between items-center">
              <div>
                <span class="text-[10px] font-extrabold uppercase tracking-[2px] text-gold block mb-0.5">RESIDENTIAL LOGISTICS</span>
                <h3 class="text-xl font-bold text-white">Save Delivery Address</h3>
              </div>
              <button (click)="closeNewAddressModal()" class="text-neutral-500 hover:text-white cursor-pointer text-lg p-1">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form (submit)="saveNewAddress($event)">
              <div class="p-6 space-y-4">
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Address Label</label>
                  <div class="grid grid-cols-3 gap-2">
                    <button type="button" 
                            (click)="newAddress.label = 'Home'"
                            [ngClass]="newAddress.label === 'Home' ? 'bg-gold text-black font-extrabold border-gold' : 'bg-[#0f0f0f] text-neutral-400 border-[#242424]'"
                            class="py-2 px-3 text-xs uppercase tracking-wider rounded border text-center transition-colors cursor-pointer">
                      <i class="fa-solid fa-house mr-1"></i> Home
                    </button>
                    <button type="button" 
                            (click)="newAddress.label = 'Office'"
                            [ngClass]="newAddress.label === 'Office' ? 'bg-gold text-black font-extrabold border-gold' : 'bg-[#0f0f0f] text-neutral-400 border-[#242424]'"
                            class="py-2 px-3 text-xs uppercase tracking-wider rounded border text-center transition-colors cursor-pointer">
                      <i class="fa-solid fa-briefcase mr-1"></i> Office
                    </button>
                    <button type="button" 
                            (click)="newAddress.label = 'Penthouse'"
                            [ngClass]="newAddress.label === 'Penthouse' ? 'bg-gold text-black font-extrabold border-gold' : 'bg-[#0f0f0f] text-neutral-400 border-[#242424]'"
                            class="py-2 px-3 text-xs uppercase tracking-wider rounded border text-center transition-colors cursor-pointer">
                      <i class="fa-solid fa-building mr-1"></i> Other
                    </button>
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Street Address *</label>
                  <input type="text" 
                         [(ngModel)]="newAddress.streetAddress" 
                         name="streetAddress" 
                         required 
                         class="w-full px-4 py-3 bg-[#0d0d0d] border border-[#242424] rounded text-white text-xs outline-none focus:border-gold transition-colors placeholder-neutral-600" 
                         placeholder="e.g. 742 Evergreen Terrace, Apt 4B" />
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">City</label>
                    <input type="text" 
                           [(ngModel)]="newAddress.city" 
                           name="city" 
                           class="w-full px-4 py-3 bg-[#0d0d0d] border border-[#242424] rounded text-white text-xs outline-none focus:border-gold transition-colors" 
                           placeholder="New York" />
                  </div>
                  <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Postal Code</label>
                    <input type="text" 
                           [(ngModel)]="newAddress.postalCode" 
                           name="postalCode" 
                           class="w-full px-4 py-3 bg-[#0d0d0d] border border-[#242424] rounded text-white text-xs outline-none focus:border-gold transition-colors" 
                           placeholder="10001" />
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Phone Number (optional)</label>
                  <input type="text" 
                         [(ngModel)]="newAddress.phone" 
                         name="phone" 
                         class="w-full px-4 py-3 bg-[#0d0d0d] border border-[#242424] rounded text-white text-xs outline-none focus:border-gold transition-colors" 
                         placeholder="+1 (555) 019-4400" />
                </div>

                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Delivery Instructions</label>
                  <input type="text" 
                         [(ngModel)]="newAddress.deliveryInstructions" 
                         name="deliveryInstructions" 
                         class="w-full px-4 py-3 bg-[#0d0d0d] border border-[#242424] rounded text-white text-xs outline-none focus:border-gold transition-colors" 
                         placeholder="e.g. Front desk concierge buzzer 14, leave at apartment door" />
                </div>

                <div class="flex items-center gap-2 pt-1">
                  <input type="checkbox" 
                         id="accountIsDefaultAddress" 
                         [(ngModel)]="newAddress.isDefault" 
                         name="isDefault"
                         class="rounded bg-[#0d0d0d] border-neutral-700 text-gold focus:ring-0 cursor-pointer" />
                  <label for="accountIsDefaultAddress" class="text-xs text-neutral-300 cursor-pointer">
                    Set as default delivery address for rapid order checkout
                  </label>
                </div>

                <div *ngIf="addressErrorMsg" class="p-3 bg-rose-950/60 border border-rose-500/40 text-rose-400 text-xs rounded">
                  {{ addressErrorMsg }}
                </div>
              </div>

              <div class="p-6 border-t border-[#242424] flex items-center justify-end gap-3 bg-[#0f0f0f]">
                <button type="button" 
                        (click)="closeNewAddressModal()" 
                        class="px-5 py-2.5 bg-transparent text-neutral-400 hover:text-white text-xs font-bold uppercase tracking-wider rounded transition-colors cursor-pointer">
                  Cancel
                </button>
                <button type="submit" 
                        [disabled]="savingAddress"
                        class="px-6 py-2.5 bg-gold hover:bg-gold-light text-black font-extrabold text-xs uppercase tracking-wider rounded transition-all cursor-pointer shadow-md disabled:opacity-50">
                  {{ savingAddress ? 'Saving...' : 'Save Address' }}
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  `
})
export class AccountComponent implements OnInit {
  currentUser: User | null = null;
  addresses: Address[] = [];
  loadingData: boolean = true;

  // Edit Form State
  editForm = {
    fullName: '',
    email: '',
    phone: ''
  };
  editSuccessMsg: string = '';

  // Address Modal & State
  showAddressModal: boolean = false;
  savingAddress: boolean = false;
  deletingAddressId: number | null = null;
  addressErrorMsg: string = '';
  newAddress: Address = {
    label: 'Home',
    streetAddress: '',
    city: 'New York',
    postalCode: '',
    phone: '',
    deliveryInstructions: '',
    isDefault: false
  };

  constructor(
    private authService: AuthService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(u => {
      this.currentUser = u;
      if (u) {
        this.editForm.fullName = u.fullName || '';
        this.editForm.email = u.email || '';
        this.editForm.phone = u.phone || '';
      }
    });

    this.loadAddresses();
  }

  get userInitials(): string {
    if (!this.currentUser?.fullName) return 'UB';
    const parts = this.currentUser.fullName.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  }

  saveProfileChanges(event?: Event): void {
    if (event) event.preventDefault();
    if (!this.editForm.fullName.trim() || !this.editForm.email.trim()) return;

    this.authService.updateLocalProfile({
      fullName: this.editForm.fullName.trim(),
      email: this.editForm.email.trim(),
      phone: this.editForm.phone.trim()
    });

    this.editSuccessMsg = 'Account details updated successfully!';
    setTimeout(() => {
      this.editSuccessMsg = '';
    }, 3000);
  }

  // --- ADDRESS MANAGEMENT METHODS ---
  openNewAddressModal(): void {
    this.addressErrorMsg = '';
    this.newAddress = {
      label: 'Home',
      streetAddress: '',
      city: 'New York',
      postalCode: '',
      phone: '',
      deliveryInstructions: '',
      isDefault: this.addresses.length === 0
    };
    this.showAddressModal = true;
  }

  closeNewAddressModal(): void {
    this.showAddressModal = false;
    this.addressErrorMsg = '';
  }

  saveNewAddress(event: Event): void {
    event.preventDefault();
    if (!this.newAddress.streetAddress || !this.newAddress.streetAddress.trim()) {
      this.addressErrorMsg = 'Street address is required.';
      return;
    }

    this.savingAddress = true;
    this.addressErrorMsg = '';

    this.orderService.addAddress(this.newAddress).subscribe({
      next: res => {
        this.savingAddress = false;
        if (res.success) {
          this.closeNewAddressModal();
          this.loadAddresses();
        } else {
          this.addressErrorMsg = res.message || 'Could not save address.';
        }
      },
      error: err => {
        this.savingAddress = false;
        this.addressErrorMsg = err.error?.message || 'Failed to save address.';
      }
    });
  }

  deleteAddress(id: number): void {
    if (!id) return;
    this.deletingAddressId = id;
    this.orderService.deleteAddress(id).subscribe({
      next: () => {
        this.deletingAddressId = null;
        this.loadAddresses();
      },
      error: () => {
        this.deletingAddressId = null;
      }
    });
  }

  loadAddresses(): void {
    this.orderService.getAddresses().subscribe({
      next: res => {
        if (res.success && res.data) {
          this.addresses = res.data;
        }
      }
    });
  }

  getAddressIcon(label: string): string {
    const l = (label || '').toLowerCase();
    if (l.includes('home')) return 'fa-house';
    if (l.includes('work') || l.includes('office')) return 'fa-briefcase';
    return 'fa-building';
  }

  logout(): void {
    this.authService.logout();
  }
}
