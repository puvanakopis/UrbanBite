import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RestaurantService } from '../../../services/restaurant.service';
import { Restaurant } from '../../../models/restaurant.models';

@Component({
  selector: 'app-restaurant-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="bg-[#090909] min-h-[90vh] py-12 sm:py-16 text-neutral-200">
      <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <!-- Customer-Style Page Header -->
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-4 border-b border-[#242424]">
          <div>
            <span class="text-xs font-bold uppercase tracking-[2.5px] text-gold mb-2 block">
              STOREFRONT & OPERATIONS
            </span>
            <div class="flex items-center gap-3">
              <h1 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Profile & Settings
              </h1>
              <span *ngIf="restaurant" class="px-2.5 py-1 text-[10px] font-bold tracking-wider rounded uppercase"
                    [ngClass]="restaurant.isOpen ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-400' : 'bg-rose-950/60 border border-rose-500/40 text-rose-400'">
                <span class="inline-block w-1.5 h-1.5 rounded-full mr-1" [ngClass]="restaurant.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'"></span>
                {{ restaurant.isOpen ? 'Kitchen Open' : 'Kitchen Closed' }}
              </span>
            </div>
          </div>

          <!-- Header Actions -->
          <div class="flex items-center gap-3">
            <a *ngIf="restaurant" [routerLink]="['/restaurants', restaurant.id]" target="_blank"
               class="px-4 py-2 border border-neutral-700 hover:border-white text-neutral-300 hover:text-white rounded text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2">
              <i class="fa-solid fa-arrow-up-right-from-square text-gold text-xs"></i>
              <span>View Storefront</span>
            </a>

            <button 
              *ngIf="restaurant"
              (click)="toggleKitchenStatus()" 
              class="px-4 py-2 border rounded font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2"
              [ngClass]="restaurant.isOpen ? 'border-[#333] text-neutral-300 hover:border-white hover:bg-white/5' : 'bg-gold hover:bg-gold-light text-black border-gold'">
              <span class="w-2 h-2 rounded-full" [ngClass]="restaurant.isOpen ? 'bg-emerald-400 shadow-[0_0_8px_#38b000]' : 'bg-rose-500'"></span>
              <span>{{ restaurant.isOpen ? 'Close Kitchen' : 'Open Kitchen' }}</span>
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="bg-[#141414] border border-[#242424] rounded p-20 text-center">
          <div class="w-10 h-10 border-2 border-neutral-700 border-t-gold rounded-full animate-spin mx-auto mb-4"></div>
          <h3 class="text-base font-bold text-white mb-1">Loading Restaurant Settings</h3>
          <p class="text-xs text-neutral-400">Retrieving operational configurations and branding...</p>
        </div>

        <!-- Main Form & Live Preview Grid -->
        <div *ngIf="!loading && restaurant" class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 items-start">
          <!-- Main Settings Form (2 cols) -->
          <div class="lg:col-span-2 bg-[#141414] border border-[#242424] rounded p-6 sm:p-8 shadow-xl">
            <div class="mb-6 pb-4 border-b border-[#242424]">
              <span class="text-xs font-bold uppercase tracking-[2px] text-gold block mb-1">STOREFRONT BRANDING</span>
              <h3 class="text-lg font-bold text-white flex items-center gap-2">
                <i class="fa-solid fa-store text-gold text-xs"></i> Restaurant Profile Configuration
              </h3>
            </div>

            <!-- Success Alert -->
            <div *ngIf="settingsSaved" class="mb-6 p-4 bg-emerald-950/60 border border-emerald-500/40 rounded text-emerald-400 text-xs flex items-center gap-2.5 animate-fadeIn">
              <i class="fa-solid fa-circle-check text-sm"></i>
              <span class="font-bold">Settings saved successfully! Changes are live on your customer storefront.</span>
            </div>

            <form (submit)="saveRestaurantSettings($event)" class="space-y-6">
              <!-- Name & Cuisine -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Restaurant Name *</label>
                  <input type="text" [(ngModel)]="restaurant.name" name="name" required class="w-full px-4 py-2.5 bg-[#0d0d0d] border border-[#242424] rounded text-white text-xs outline-none focus:border-gold transition-colors placeholder:text-neutral-600" />
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Cuisine Specialization</label>
                  <input type="text" [(ngModel)]="restaurant.cuisine" name="cuisine" placeholder="e.g. Italian, Modern Bistro" class="w-full px-4 py-2.5 bg-[#0d0d0d] border border-[#242424] rounded text-white text-xs outline-none focus:border-gold transition-colors placeholder:text-neutral-600" />
                </div>
              </div>

              <!-- Tagline -->
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Tagline & Chef's Note</label>
                <input type="text" [(ngModel)]="restaurant.tagline" name="tagline" placeholder="e.g. Authentic artisanal sourdough pizzas & handcrafted pasta" class="w-full px-4 py-2.5 bg-[#0d0d0d] border border-[#242424] rounded text-white text-xs outline-none focus:border-gold transition-colors placeholder:text-neutral-600" />
              </div>

              <!-- Address & City -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Full Street Address</label>
                  <input type="text" [(ngModel)]="restaurant.address" name="address" class="w-full px-4 py-2.5 bg-[#0d0d0d] border border-[#242424] rounded text-white text-xs outline-none focus:border-gold transition-colors placeholder:text-neutral-600" />
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">City</label>
                  <input type="text" [(ngModel)]="restaurant.city" name="city" class="w-full px-4 py-2.5 bg-[#0d0d0d] border border-[#242424] rounded text-white text-xs outline-none focus:border-gold transition-colors placeholder:text-neutral-600" />
                </div>
              </div>

              <!-- Operating Hours & Delivery Fee -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Operating Hours</label>
                  <input type="text" [(ngModel)]="restaurant.openingHours" name="openingHours" class="w-full px-4 py-2.5 bg-[#0d0d0d] border border-[#242424] rounded text-white text-xs outline-none focus:border-gold transition-colors placeholder:text-neutral-600" placeholder="Daily 10:00 AM - 11:30 PM" />
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Base Delivery Fee ($)</label>
                  <input type="number" step="0.5" [(ngModel)]="restaurant.deliveryFee" name="deliveryFee" class="w-full px-4 py-2.5 bg-[#0d0d0d] border border-[#242424] rounded text-white text-xs outline-none focus:border-gold transition-colors placeholder:text-neutral-600" />
                </div>
              </div>

              <!-- Cover Image URL -->
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Cover Banner Image URL</label>
                <input type="text" [(ngModel)]="restaurant.imageUrl" name="imageUrl" class="w-full px-4 py-2.5 bg-[#0d0d0d] border border-[#242424] rounded text-white text-xs outline-none focus:border-gold transition-colors placeholder:text-neutral-600" placeholder="https://images.unsplash.com/photo-..." />
              </div>

              <!-- Kitchen Open / Closed Operational Box -->
              <div class="p-5 bg-[#0d0d0d] border border-[#242424] rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span class="block text-xs font-bold text-white uppercase tracking-wider">Kitchen Order Reception</span>
                  <p class="text-[11px] text-neutral-400 mt-0.5">Control whether customer checkout can accept orders right now</p>
                </div>
                <button 
                  type="button"
                  (click)="toggleKitchenStatus()" 
                  class="px-4 py-2 rounded text-xs font-bold uppercase tracking-wider border cursor-pointer transition-all flex items-center gap-2"
                  [ngClass]="restaurant.isOpen ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-400 hover:bg-emerald-900/60' : 'bg-rose-950/60 border-rose-500/50 text-rose-400 hover:bg-rose-900/60'">
                  <span class="w-2 h-2 rounded-full" [ngClass]="restaurant.isOpen ? 'bg-emerald-400 shadow-[0_0_8px_#38b000]' : 'bg-rose-500'"></span>
                  <span>{{ restaurant.isOpen ? 'OPEN FOR ORDERS' : 'KITCHEN CLOSED' }}</span>
                </button>
              </div>

              <div class="pt-2 flex items-center gap-4">
                <button 
                  type="submit" 
                  class="px-8 py-3 bg-gold hover:bg-gold-light text-black font-extrabold text-xs uppercase tracking-wider rounded transition-all cursor-pointer disabled:opacity-40 shadow-md" 
                  [disabled]="savingSettings">
                  {{ savingSettings ? 'SAVING CHANGES...' : 'SAVE RESTAURANT PROFILE' }}
                </button>
              </div>
            </form>
          </div>

          <!-- Live Customer Card Preview (1 col) -->
          <div class="space-y-6">
            <div class="bg-[#141414] border border-[#242424] rounded p-6 shadow-xl">
              <span class="text-xs font-bold uppercase tracking-[2px] text-gold block mb-1">LIVE PREVIEW</span>
              <h3 class="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <i class="fa-solid fa-eye text-gold"></i> Storefront Card Preview
              </h3>

              <!-- Customer Card Representation -->
              <div class="bg-[#181818] border border-[#242424] rounded overflow-hidden shadow-lg">
                <div class="relative h-44 bg-neutral-900">
                  <img [src]="restaurant.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80'" 
                       class="w-full h-full object-cover" />
                  <div class="absolute top-3 right-3">
                    <span class="px-2.5 py-1 text-[10px] font-bold tracking-wider rounded uppercase shadow"
                          [ngClass]="restaurant.isOpen ? 'bg-emerald-500 text-black' : 'bg-rose-500 text-white'">
                      {{ restaurant.isOpen ? 'Open Now' : 'Closed' }}
                    </span>
                  </div>
                </div>

                <div class="p-5">
                  <div class="flex justify-between items-start mb-1">
                    <h4 class="text-base font-extrabold text-white tracking-tight">{{ restaurant.name }}</h4>
                    <span class="text-xs font-bold text-gold flex items-center gap-1">
                      <i class="fa-solid fa-star text-[10px]"></i> {{ restaurant.rating || 4.8 | number:'1.1-1' }}
                    </span>
                  </div>

                  <p class="text-xs text-neutral-400 mb-3">{{ restaurant.cuisine || 'Fine Dining' }}</p>

                  <div class="flex items-center justify-between pt-3 border-t border-[#242424] text-[11px] text-neutral-400">
                    <span><i class="fa-solid fa-person-biking mr-1 text-gold"></i> &#36;{{ restaurant.deliveryFee || 2.99 | number:'1.2-2' }} Delivery</span>
                    <span><i class="fa-regular fa-clock mr-1 text-gold"></i> 25-35 min</span>
                  </div>
                </div>
              </div>

              <!-- Quick View Storefront Button -->
              <div class="mt-4">
                <a [routerLink]="['/restaurants', restaurant.id]" target="_blank"
                   class="w-full py-2.5 px-4 bg-[#141414] hover:bg-[#1e1e1e] hover:text-white text-neutral-300 text-xs font-bold uppercase tracking-wider rounded transition-all flex items-center justify-center gap-2 border border-[#242424] hover:border-neutral-600">
                  <span>Open Storefront Page</span>
                  <i class="fa-solid fa-arrow-up-right-from-square text-[10px] text-gold"></i>
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  `
})
export class RestaurantSettingsComponent implements OnInit {
  restaurant: Restaurant | null = null;
  loading: boolean = true;
  savingSettings: boolean = false;
  settingsSaved: boolean = false;

  constructor(private restaurantService: RestaurantService) {}

  ngOnInit(): void {
    this.loadRestaurant();
  }

  loadRestaurant(): void {
    this.loading = true;
    this.restaurantService.getMyRestaurant().subscribe({
      next: res => {
        this.loading = false;
        if (res.success && res.data) {
          this.restaurant = res.data;
        }
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  toggleKitchenStatus(): void {
    this.restaurantService.toggleOpenStatus().subscribe({
      next: res => {
        if (res.success && res.data && this.restaurant) {
          this.restaurant.isOpen = res.data.isOpen;
        }
      }
    });
  }

  saveRestaurantSettings(event: Event): void {
    event.preventDefault();
    if (!this.restaurant) return;

    this.savingSettings = true;
    this.settingsSaved = false;

    this.restaurantService.updateMyRestaurant(this.restaurant).subscribe({
      next: res => {
        this.savingSettings = false;
        this.settingsSaved = true;
        setTimeout(() => this.settingsSaved = false, 4000);
      },
      error: () => {
        this.savingSettings = false;
      }
    });
  }
}
