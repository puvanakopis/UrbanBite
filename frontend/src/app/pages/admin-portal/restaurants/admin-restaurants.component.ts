import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { Restaurant } from '../../../models/restaurant.models';

@Component({
  selector: 'app-admin-restaurants',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="bg-[#090909] min-h-[90vh] py-12 sm:py-16 text-neutral-200">
      <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <!-- Executive Page Header -->
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-4 border-b border-[#242424]">
          <div>
            <span class="text-xs font-bold uppercase tracking-[2.5px] text-gold mb-2 block">
              RESTAURANT PORTFOLIO & MODERATION
            </span>
            <div class="flex items-center gap-3">
              <h1 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Restaurant Management
              </h1>
              <span class="px-2.5 py-1 text-[10px] font-bold tracking-wider rounded uppercase bg-emerald-950/60 border border-emerald-500/40 text-emerald-400">
                <span class="inline-block w-1.5 h-1.5 rounded-full mr-1 bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]"></span>
                {{ approvedCount }} Approved Lofts
              </span>
            </div>
          </div>

          <!-- Header Actions -->
          <div class="flex items-center gap-3">
            <button 
              (click)="loadRestaurants()" 
              class="px-4 py-2 border border-neutral-700 hover:border-white text-neutral-300 hover:text-white rounded text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2">
              <i class="fa-solid fa-arrows-rotate" [ngClass]="{'fa-spin': loading}"></i>
              <span>Refresh</span>
            </button>

            <a 
              routerLink="/admin-portal/dashboard" 
              class="px-5 py-2.5 bg-gold hover:bg-gold-light text-black font-extrabold text-xs uppercase tracking-wider rounded transition-all cursor-pointer shadow-md flex items-center gap-2">
              <i class="fa-solid fa-chart-pie"></i>
              <span>Dashboard</span>
            </a>
          </div>
        </div>

        <!-- Metric KPI Cards Strip -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div class="bg-[#141414] border border-[#242424] rounded p-6 shadow-xl flex flex-col justify-between hover:border-neutral-700 transition-colors">
            <div class="flex justify-between items-start mb-3">
              <span class="text-[11px] font-bold tracking-wider text-neutral-400 uppercase">TOTAL RESTAURANTS</span>
              <i class="fa-solid fa-store text-xs text-gold"></i>
            </div>
            <span class="text-3xl font-extrabold text-white font-serif mb-1">{{ restaurants.length }}</span>
            <span class="text-xs text-neutral-500">Registered platform partners</span>
          </div>

          <div class="bg-[#141414] border border-[#242424] rounded p-6 shadow-xl flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
            <div class="flex justify-between items-start mb-3">
              <span class="text-[11px] font-bold tracking-wider uppercase text-emerald-400">APPROVED & LIVE</span>
              <i class="fa-solid fa-circle-check text-xs text-emerald-400"></i>
            </div>
            <span class="text-3xl font-extrabold text-emerald-400 font-serif mb-1">{{ approvedCount }}</span>
            <span class="text-xs text-neutral-500">Active catalog lofts</span>
          </div>

          <div class="bg-[#141414] border border-[#242424] rounded p-6 shadow-xl flex flex-col justify-between hover:border-rose-500/40 transition-colors">
            <div class="flex justify-between items-start mb-3">
              <span class="text-[11px] font-bold tracking-wider uppercase text-rose-400">SUSPENDED / INACTIVE</span>
              <i class="fa-solid fa-ban text-xs text-rose-400"></i>
            </div>
            <span class="text-3xl font-extrabold text-rose-400 font-serif mb-1">{{ suspendedCount }}</span>
            <span class="text-xs text-neutral-500">Temporarily halted operations</span>
          </div>

          <div class="bg-[#141414] border border-[#242424] rounded p-6 shadow-xl flex flex-col justify-between hover:border-gold/40 transition-colors">
            <div class="flex justify-between items-start mb-3">
              <span class="text-[11px] font-bold tracking-wider text-gold uppercase">KITCHENS OPEN</span>
              <i class="fa-solid fa-fire-burner text-xs text-gold"></i>
            </div>
            <span class="text-3xl font-extrabold text-gold font-serif mb-1">{{ openKitchensCount }}</span>
            <span class="text-xs text-neutral-500">Accepting live customer orders</span>
          </div>
        </div>

        <!-- Filter & Search Toolbar (Customer & Restaurant Orders Style) -->
        <div class="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-6">
          
          <!-- Dropdowns Group: Status Filter + Cuisine Filter -->
          <div class="flex flex-wrap items-center gap-3">
            
            <!-- Status Dropdown Selector -->
            <div class="relative min-w-[200px] sm:w-60">
              <div class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold text-xs pointer-events-none">
                <i class="fa-solid fa-filter"></i>
              </div>
              <select 
                [(ngModel)]="selectedStatusFilter" 
                class="w-full pl-9 pr-9 py-2 bg-[#141414] border border-[#242424] rounded text-xs text-white focus:outline-none focus:border-gold transition-colors appearance-none cursor-pointer font-bold tracking-wider uppercase">
                <option value="ALL" class="bg-[#141414] text-white">All Statuses ({{ restaurants.length }})</option>
                <option value="APPROVED" class="bg-[#141414] text-white">Approved ({{ approvedCount }})</option>
                <option value="SUSPENDED" class="bg-[#141414] text-white">Suspended ({{ suspendedCount }})</option>
                <option value="PENDING" class="bg-[#141414] text-white">Pending Approval</option>
              </select>
              <div class="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-[10px] pointer-events-none">
                <i class="fa-solid fa-chevron-down"></i>
              </div>
            </div>

            <!-- Cuisine Dropdown Selector -->
            <div class="relative min-w-[180px] sm:w-56">
              <div class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold text-xs pointer-events-none">
                <i class="fa-solid fa-utensils"></i>
              </div>
              <select 
                [(ngModel)]="selectedCuisineFilter" 
                class="w-full pl-9 pr-9 py-2 bg-[#141414] border border-[#242424] rounded text-xs text-white focus:outline-none focus:border-gold transition-colors appearance-none cursor-pointer font-bold tracking-wider uppercase">
                <option value="ALL" class="bg-[#141414] text-white">All Cuisines</option>
                <option *ngFor="let c of uniqueCuisines" [value]="c" class="bg-[#141414] text-white">{{ c }}</option>
              </select>
              <div class="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-[10px] pointer-events-none">
                <i class="fa-solid fa-chevron-down"></i>
              </div>
            </div>

            <!-- Showing Count Badge -->
            <span class="hidden md:inline-flex items-center px-2.5 py-1.5 text-[11px] font-bold text-neutral-400 bg-[#141414] border border-[#242424] rounded">
              Showing {{ filteredRestaurants.length }} of {{ restaurants.length }}
            </span>
          </div>

          <!-- Search Bar -->
          <div class="relative min-w-[260px] md:w-80">
            <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 text-xs"></i>
            <input 
              type="text" 
              [(ngModel)]="searchQuery" 
              placeholder="Search by restaurant name, city, cuisine..." 
              class="w-full pl-9 pr-8 py-2 bg-[#141414] border border-[#242424] rounded text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-gold transition-colors" />
            <button *ngIf="searchQuery" 
                    (click)="searchQuery = ''" 
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white text-xs">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        <!-- Feedback Alert Banner -->
        <div *ngIf="feedbackMessage" 
             class="mb-6 p-4 bg-emerald-950/60 border border-emerald-500/40 rounded text-emerald-400 text-xs flex items-center justify-between gap-4 animate-fadeIn">
          <div class="flex items-center gap-2.5">
            <i class="fa-solid fa-circle-check text-sm"></i>
            <span class="font-bold">{{ feedbackMessage }}</span>
          </div>
          <button (click)="feedbackMessage = ''" class="text-emerald-400 hover:text-white text-xs cursor-pointer">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="bg-[#141414] border border-[#242424] rounded p-20 text-center mb-8">
          <div class="w-10 h-10 border-2 border-neutral-700 border-t-gold rounded-full animate-spin mx-auto mb-4"></div>
          <h3 class="text-base font-bold text-white mb-1">Retrieving Restaurant Portfolio</h3>
          <p class="text-xs text-neutral-400">Loading catalog venues and moderation statuses...</p>
        </div>

        <!-- Empty State -->
        <div *ngIf="!loading && filteredRestaurants.length === 0" 
             class="bg-[#141414] border border-[#242424] rounded p-16 text-center text-neutral-500 text-xs shadow-xl mb-8">
          <div class="w-16 h-16 rounded bg-[#1b1b1b] border border-[#282828] mx-auto flex items-center justify-center text-gold/80 text-2xl mb-4">
            <i class="fa-solid fa-store"></i>
          </div>
          <p class="font-bold text-white text-base">No restaurants matched criteria</p>
          <p class="text-xs text-neutral-400 mt-1 mb-4">
            {{ searchQuery ? 'No venues match your current search terms.' : 'No partner restaurants found for the selected status.' }}
          </p>
          <button (click)="resetFilters()" 
                  class="px-5 py-2.5 bg-gold hover:bg-gold-light text-black font-extrabold text-xs uppercase tracking-wider rounded transition-all cursor-pointer shadow-md inline-flex items-center gap-2">
            <i class="fa-solid fa-arrows-rotate"></i> Reset Filters
          </button>
        </div>

        <!-- Restaurants Moderation Table -->
        <div *ngIf="!loading && filteredRestaurants.length > 0" 
             class="bg-[#141414] border border-[#242424] rounded shadow-xl overflow-hidden mb-12">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs border-collapse">
              <thead>
                <tr class="border-b border-[#242424] text-neutral-400 font-bold uppercase tracking-wider bg-[#0f0f0f]">
                  <th class="p-4 sm:p-5">Restaurant & Tagline</th>
                  <th class="p-4 sm:p-5">Cuisine & City</th>
                  <th class="p-4 sm:p-5">Rating</th>
                  <th class="p-4 sm:p-5 text-center">Kitchen Open</th>
                  <th class="p-4 sm:p-5 text-center">Status</th>
                  <th class="p-4 sm:p-5 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#1e1e1e]">
                <tr *ngFor="let rest of filteredRestaurants" class="hover:bg-[#181818] transition-colors">
                  <!-- Name & Tagline -->
                  <td class="p-4 sm:p-5">
                    <strong class="text-white block text-sm">{{ rest.name }}</strong>
                    <span class="text-neutral-500 text-[11px] block truncate max-w-xs">{{ rest.tagline || rest.address }}</span>
                  </td>

                  <!-- Cuisine & City -->
                  <td class="p-4 sm:p-5">
                    <span class="text-gold font-bold block">{{ rest.cuisine }}</span>
                    <span class="text-neutral-400 text-[11px]">{{ rest.city }}</span>
                  </td>

                  <!-- Rating -->
                  <td class="p-4 sm:p-5">
                    <div class="flex items-center gap-1.5 text-gold font-bold">
                      <i class="fa-solid fa-star text-xs"></i>
                      <span>{{ rest.rating | number:'1.1-1' }}</span>
                      <span class="text-neutral-500 text-[10px] font-normal">({{ rest.totalReviews || 0 }})</span>
                    </div>
                  </td>

                  <!-- Kitchen Status -->
                  <td class="p-4 sm:p-5 text-center">
                    <span class="px-2.5 py-1 rounded text-[10px] font-bold uppercase"
                          [ngClass]="rest.isOpen ? 'bg-emerald-950/60 border border-emerald-500/30 text-emerald-400' : 'bg-neutral-900 border border-neutral-700 text-neutral-500'">
                      <span class="inline-block w-1.5 h-1.5 rounded-full mr-1" [ngClass]="rest.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-neutral-500'"></span>
                      {{ rest.isOpen ? 'Open' : 'Closed' }}
                    </span>
                  </td>

                  <!-- Moderation Status -->
                  <td class="p-4 sm:p-5 text-center">
                    <span class="px-2.5 py-1 text-[10px] font-extrabold tracking-wider rounded uppercase border"
                          [ngClass]="{
                            'bg-emerald-950/60 border-emerald-500/40 text-emerald-400': rest.status === 'APPROVED',
                            'bg-rose-950/60 border-rose-500/40 text-rose-400': rest.status === 'SUSPENDED',
                            'bg-gold/15 border-gold/40 text-gold': rest.status === 'PENDING'
                          }">
                      {{ rest.status }}
                    </span>
                  </td>

                  <!-- Moderation Actions -->
                  <td class="p-4 sm:p-5 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <button (click)="openDetailModal(rest)" 
                              class="px-2.5 py-1 text-[11px] font-bold rounded border border-neutral-700 hover:border-white text-neutral-300 hover:text-white transition-all cursor-pointer">
                        <i class="fa-solid fa-eye mr-1"></i> Details
                      </button>

                      <button *ngIf="rest.status !== 'APPROVED'" 
                              (click)="updateStatus(rest.id, 'APPROVED')" 
                              class="px-3 py-1 text-[11px] font-bold rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500 hover:text-black transition-all cursor-pointer">
                        <i class="fa-solid fa-check mr-1"></i> Approve
                      </button>

                      <button *ngIf="rest.status !== 'SUSPENDED'" 
                              (click)="updateStatus(rest.id, 'SUSPENDED')" 
                              class="px-3 py-1 text-[11px] font-bold rounded bg-rose-950/60 border border-rose-500/40 text-rose-400 hover:bg-rose-500 hover:text-white transition-all cursor-pointer">
                        <i class="fa-solid fa-ban mr-1"></i> Suspend
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Detail Inspection Modal -->
        <div *ngIf="inspectingRestaurant" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div class="bg-[#141414] border border-[#242424] rounded-lg max-w-2xl w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div class="flex justify-between items-start pb-4 border-b border-[#242424] mb-6">
              <div>
                <span class="text-xs font-bold uppercase tracking-[2px] text-gold block">VENUE METADATA</span>
                <h3 class="text-xl font-extrabold text-white">{{ inspectingRestaurant.name }}</h3>
                <p class="text-xs text-neutral-400">{{ inspectingRestaurant.tagline }}</p>
              </div>
              <button (click)="inspectingRestaurant = null" class="text-neutral-500 hover:text-white text-base cursor-pointer">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div class="space-y-4 text-xs">
              <div class="grid grid-cols-2 gap-4 p-4 rounded bg-[#0d0d0d] border border-[#202020]">
                <div>
                  <span class="text-neutral-500 uppercase block font-bold text-[10px]">Cuisine Category</span>
                  <span class="text-white font-bold text-sm">{{ inspectingRestaurant.cuisine }}</span>
                </div>
                <div>
                  <span class="text-neutral-500 uppercase block font-bold text-[10px]">Operating Status</span>
                  <span class="text-emerald-400 font-bold text-sm">{{ inspectingRestaurant.status }}</span>
                </div>
                <div>
                  <span class="text-neutral-500 uppercase block font-bold text-[10px]">Kitchen Active</span>
                  <span class="text-white font-bold">{{ inspectingRestaurant.isOpen ? 'Open For Orders' : 'Closed' }}</span>
                </div>
                <div>
                  <span class="text-neutral-500 uppercase block font-bold text-[10px]">Rating Score</span>
                  <span class="text-gold font-bold">★ {{ inspectingRestaurant.rating }} ({{ inspectingRestaurant.totalReviews }} reviews)</span>
                </div>
              </div>

              <div>
                <span class="text-neutral-400 uppercase block font-bold text-[10px] mb-1">Physical Location Address</span>
                <p class="text-white bg-[#0d0d0d] border border-[#202020] rounded p-3">{{ inspectingRestaurant.address }}, {{ inspectingRestaurant.city }}</p>
              </div>

              <div *ngIf="inspectingRestaurant.description">
                <span class="text-neutral-400 uppercase block font-bold text-[10px] mb-1">Restaurant Description</span>
                <p class="text-neutral-300 bg-[#0d0d0d] border border-[#202020] rounded p-3 leading-relaxed">{{ inspectingRestaurant.description }}</p>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="p-3 rounded bg-[#0d0d0d] border border-[#202020]">
                  <span class="text-neutral-500 uppercase block font-bold text-[10px]">Delivery Fee</span>
                  <span class="text-white font-bold">&#36;{{ inspectingRestaurant.deliveryFee | number:'1.2-2' }}</span>
                </div>
                <div class="p-3 rounded bg-[#0d0d0d] border border-[#202020]">
                  <span class="text-neutral-500 uppercase block font-bold text-[10px]">Minimum Order</span>
                  <span class="text-white font-bold">&#36;{{ inspectingRestaurant.minOrderAmount | number:'1.2-2' }}</span>
                </div>
              </div>
            </div>

            <div class="mt-6 pt-4 border-t border-[#242424] flex items-center justify-between">
              <div class="flex gap-2">
                <button *ngIf="inspectingRestaurant.status !== 'APPROVED'" 
                        (click)="updateStatus(inspectingRestaurant.id, 'APPROVED')" 
                        class="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider rounded transition-all cursor-pointer">
                  Approve Venue
                </button>
                <button *ngIf="inspectingRestaurant.status !== 'SUSPENDED'" 
                        (click)="updateStatus(inspectingRestaurant.id, 'SUSPENDED')" 
                        class="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs uppercase tracking-wider rounded transition-all cursor-pointer">
                  Suspend Venue
                </button>
              </div>

              <button (click)="inspectingRestaurant = null" 
                      class="px-4 py-2 border border-neutral-700 hover:border-white text-neutral-300 hover:text-white rounded text-xs font-bold uppercase tracking-wider transition-all cursor-pointer">
                Close
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  `
})
export class AdminRestaurantsComponent implements OnInit {
  restaurants: Restaurant[] = [];
  loading = false;
  feedbackMessage = '';
  inspectingRestaurant: Restaurant | null = null;

  selectedStatusFilter = 'ALL';
  selectedCuisineFilter = 'ALL';
  searchQuery = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadRestaurants();
  }

  loadRestaurants(): void {
    this.loading = true;
    this.adminService.getAllRestaurants().subscribe({
      next: res => {
        this.loading = false;
        if (res.success && res.data) {
          this.restaurants = res.data;
        }
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  get approvedCount(): number {
    return this.restaurants.filter(r => r.status === 'APPROVED').length;
  }

  get suspendedCount(): number {
    return this.restaurants.filter(r => r.status === 'SUSPENDED').length;
  }

  get openKitchensCount(): number {
    return this.restaurants.filter(r => r.isOpen).length;
  }

  get uniqueCuisines(): string[] {
    const set = new Set<string>();
    this.restaurants.forEach(r => {
      if (r.cuisine) set.add(r.cuisine);
    });
    return Array.from(set);
  }

  get filteredRestaurants(): Restaurant[] {
    return this.restaurants.filter(r => {
      // Status filter
      if (this.selectedStatusFilter !== 'ALL' && r.status !== this.selectedStatusFilter) {
        return false;
      }
      // Cuisine filter
      if (this.selectedCuisineFilter !== 'ALL' && r.cuisine !== this.selectedCuisineFilter) {
        return false;
      }
      // Search query
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        const matchesName = r.name?.toLowerCase().includes(q);
        const matchesCity = r.city?.toLowerCase().includes(q);
        const matchesCuisine = r.cuisine?.toLowerCase().includes(q);
        const matchesAddress = r.address?.toLowerCase().includes(q);
        if (!matchesName && !matchesCity && !matchesCuisine && !matchesAddress) {
          return false;
        }
      }
      return true;
    });
  }

  resetFilters(): void {
    this.selectedStatusFilter = 'ALL';
    this.selectedCuisineFilter = 'ALL';
    this.searchQuery = '';
    this.loadRestaurants();
  }

  openDetailModal(restaurant: Restaurant): void {
    this.inspectingRestaurant = restaurant;
  }

  updateStatus(restaurantId: number, status: string): void {
    this.adminService.updateRestaurantStatus(restaurantId, status).subscribe({
      next: () => {
        this.feedbackMessage = `Restaurant moderation status successfully updated to ${status}.`;
        if (this.inspectingRestaurant && this.inspectingRestaurant.id === restaurantId) {
          this.inspectingRestaurant = { ...this.inspectingRestaurant, status: status as any };
        }
        this.loadRestaurants();
        setTimeout(() => {
          this.feedbackMessage = '';
        }, 5000);
      }
    });
  }
}
