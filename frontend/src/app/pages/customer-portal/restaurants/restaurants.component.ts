import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RestaurantService } from '../../../services/restaurant.service';
import { Restaurant } from '../../../models/restaurant.models';

@Component({
  selector: 'app-restaurants',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="bg-[#090909] min-h-screen">
      <!-- TOP PAGE TITLE & SEARCH BAR -->
      <div class="w-full max-w-7xl mx-auto px-6 pt-8 pb-5">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-5">
          <!-- Page Title & Count -->
          <div>
            <span class="text-[10px] font-extrabold uppercase tracking-[2.5px] text-gold mb-1 block">
              CURATED GASTRONOMY
            </span>
            <h1 class="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
              Restaurants & Lofts
            </h1>
            <p class="text-xs text-neutral-400 mt-1">
              Explore <span class="text-white font-bold">{{ filteredRestaurants.length }}</span> premier dining destinations
            </p>
          </div>

          <!-- Quick Search & Sort -->
          <div class="flex items-center gap-3 w-full md:w-auto">
            <!-- Search Input -->
            <div class="relative flex-grow md:w-72 lg:w-80">
              <i class="fa-solid fa-magnifying-glass absolute top-3.5 left-4 text-gold text-xs"></i>
              <input 
                type="text" 
                [(ngModel)]="searchQuery" 
                (ngModelChange)="applyFilters()"
                placeholder="Search restaurants, cuisines, dishes..." 
                class="w-full pl-11 pr-8 py-2.5 bg-[#141414] border border-[#282828] focus:border-gold rounded text-white text-xs outline-none transition-colors placeholder:text-neutral-500 shadow-inner" />
              <button *ngIf="searchQuery" (click)="searchQuery = ''; applyFilters()" 
                      class="absolute top-2.5 right-3 text-neutral-400 hover:text-white cursor-pointer transition-colors">
                <i class="fa-solid fa-xmark text-xs"></i>
              </button>
            </div>

            <!-- Sort Dropdown -->
            <div class="relative shrink-0">
              <select [(ngModel)]="sortBy" (change)="applyFilters()" 
                      class="px-4 py-2.5 bg-[#141414] border border-[#282828] focus:border-gold rounded text-white text-xs font-semibold outline-none cursor-pointer transition-colors">
                <option value="rating">Top Rated ★</option>
                <option value="time">Fastest ⏱</option>
                <option value="fee">Lowest Fee</option>
                <option value="name">A - Z</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- STICKY USER-FRIENDLY FILTER STRIP -->
      <div class="sticky top-[76px] z-30 bg-[#090909]/95 backdrop-blur-md py-3.5 mb-10 shadow-lg">
        <div class="w-full max-w-7xl mx-auto px-6 flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
          <!-- Cuisine Tabs -->
          <div class="flex items-center gap-2 shrink-0">
            <button 
              *ngFor="let c of cuisineOptions" 
              (click)="selectedCuisine = c; applyFilters()" 
              [ngClass]="selectedCuisine === c ? 'bg-white text-black font-extrabold shadow-md' : 'bg-[#141414] text-neutral-400 border border-[#262626] hover:text-white hover:border-gold/40'"
              class="px-4 py-2 text-xs font-semibold rounded transition-all duration-200 cursor-pointer">
              {{ c }}
            </button>
          </div>

          <!-- Action Filters (Open Now Toggle & Clear) -->
          <div class="flex items-center gap-2.5 shrink-0">
            <button 
              (click)="openOnly = !openOnly; applyFilters()" 
              [ngClass]="openOnly ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-400 font-bold' : 'bg-[#141414] border border-[#262626] text-neutral-400 hover:text-white'"
              class="px-3.5 py-2 rounded border text-xs flex items-center gap-1.5 transition-all cursor-pointer">
              <span class="w-2 h-2 rounded-full" [ngClass]="openOnly ? 'bg-emerald-400 animate-pulse' : 'bg-neutral-500'"></span>
              <span>Open Now</span>
            </button>

            <button 
              *ngIf="selectedCuisine !== 'All' || searchQuery || openOnly" 
              (click)="resetFilters()" 
              class="px-3 py-2 text-xs font-bold text-neutral-400 hover:text-gold transition-colors flex items-center gap-1 cursor-pointer">
              <i class="fa-solid fa-rotate-left text-[10px]"></i> <span>Clear Filters</span>
            </button>
          </div>
        </div>
      </div>

      <!-- MAIN RESTAURANTS CONTENT -->
      <div class="w-full max-w-7xl mx-auto px-6 pb-24">
        <!-- LOADING STATE -->
        <div *ngIf="loading" class="text-center py-24 bg-[#141414] border border-[#242424] rounded shadow-xl">
          <div class="w-10 h-10 border-2 border-neutral-800 border-t-gold rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-xs uppercase tracking-[2px] text-neutral-400 font-semibold">Discovering artisanal partner kitchens...</p>
        </div>

        <!-- EMPTY STATE -->
        <div *ngIf="!loading && filteredRestaurants.length === 0" class="text-center py-24 bg-[#141414] border border-[#242424] rounded shadow-xl px-6">
          <div class="w-16 h-16 rounded-full bg-[#1b1b1b] border border-[#2b2b2b] flex items-center justify-center mx-auto mb-5 text-gold text-2xl">
            <i class="fa-solid fa-utensils"></i>
          </div>
          <h3 class="text-2xl font-bold text-white mb-2">No Partner Bistros Match Your Criteria</h3>
          <p class="text-sm text-neutral-400 max-w-md mx-auto mb-8 leading-relaxed">
            Try adjusting your search query or selecting a different cuisine filter to view all available dining experiences.
          </p>
          <button (click)="resetFilters()" class="px-7 py-3.5 bg-white hover:bg-gold text-black font-extrabold text-xs uppercase tracking-[2px] rounded transition-all shadow-xl hover:-translate-y-0.5 cursor-pointer">
            RESET ALL FILTERS
          </button>
        </div>

        <!-- RESTAURANTS GRID -->
        <div *ngIf="!loading && filteredRestaurants.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div *ngFor="let restaurant of filteredRestaurants" 
               class="bg-[#141414] border border-[#242424] hover:border-gold/50 rounded overflow-hidden hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(0,0,0,0.85)] transition-all duration-500 flex flex-col group">
            
            <!-- Card Image Area -->
            <div class="relative h-60 overflow-hidden bg-neutral-950">
              <img [src]="restaurant.imageUrl" [alt]="restaurant.name" 
                   class="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700" />
              
              <!-- Dark Vignette Overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"></div>

              <!-- Badges -->
              <div class="absolute top-4 left-4 flex items-center gap-2">
                <span class="text-[10px] font-extrabold tracking-wider px-3 py-1 rounded backdrop-blur-md border flex items-center gap-1.5 shadow-md"
                      [ngClass]="restaurant.isOpen ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40' : 'bg-black/80 text-neutral-400 border-neutral-700'">
                  <span class="w-1.5 h-1.5 rounded-full" [ngClass]="restaurant.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-neutral-500'"></span>
                  <span>{{ restaurant.isOpen ? 'OPEN NOW' : 'CLOSED' }}</span>
                </span>
              </div>

              <div class="absolute top-4 right-4">
                <span class="text-xs font-extrabold px-3 py-1 rounded bg-black/85 backdrop-blur border border-white/10 text-gold flex items-center gap-1.5 shadow-md">
                  <i class="fa-solid fa-star text-[10px]"></i> {{ restaurant.rating }}
                  <span class="text-neutral-400 text-[10px] font-normal">({{ restaurant.totalReviews }})</span>
                </span>
              </div>

              <!-- City Pill on bottom left of image -->
              <div class="absolute bottom-3 left-4 flex items-center gap-1.5 text-xs text-white/90 font-medium drop-shadow">
                <i class="fa-solid fa-location-dot text-gold text-[10px]"></i>
                <span>{{ restaurant.city }}</span>
              </div>
            </div>

            <!-- Card Body -->
            <div class="p-6 sm:p-7 flex flex-col flex-grow">
              <span class="text-[10px] font-extrabold tracking-[2px] uppercase text-gold mb-2 block">
                {{ restaurant.cuisine }} GASTRONOMY
              </span>
              <h3 class="text-xl font-bold text-white mb-2 group-hover:text-gold transition-colors leading-snug">
                {{ restaurant.name }}
              </h3>
              <p class="text-xs sm:text-sm text-neutral-400 line-clamp-2 leading-relaxed mb-6 flex-grow">
                {{ restaurant.tagline || restaurant.description }}
              </p>

              <!-- Metadata Strip -->
              <div class="grid grid-cols-3 gap-2 py-3.5 border-t border-b border-[#202020] text-center text-neutral-300 text-xs mb-6">
                <div>
                  <span class="block text-[10px] uppercase tracking-wider text-neutral-500 font-bold mb-0.5">DISPATCH</span>
                  <span class="font-bold text-white flex items-center justify-center gap-1 text-[11px]">
                    <i class="fa-regular fa-clock text-gold text-[10px]"></i> {{ restaurant.avgDeliveryTimeMinutes }}m
                  </span>
                </div>
                <div class="border-x border-[#202020]">
                  <span class="block text-[10px] uppercase tracking-wider text-neutral-500 font-bold mb-0.5">COURIER</span>
                  <span class="font-bold text-white text-[11px]">
                    {{ restaurant.deliveryFee === 0 ? 'FREE' : ('$' + restaurant.deliveryFee) }}
                  </span>
                </div>
                <div>
                  <span class="block text-[10px] uppercase tracking-wider text-neutral-500 font-bold mb-0.5">MIN ORDER</span>
                  <span class="font-bold text-white text-[11px]">
                    &#36;{{ restaurant.minOrderAmount }}
                  </span>
                </div>
              </div>

              <!-- Action CTA -->
              <a [routerLink]="['/restaurants', restaurant.id]" 
                 class="w-full py-3.5 bg-white hover:bg-gold text-black font-extrabold text-xs uppercase tracking-[2px] rounded transition-all duration-300 shadow-lg hover:shadow-gold/20 flex items-center justify-center gap-2 group/btn">
                <span>EXPLORE MENU & ORDER</span>
                <i class="fa-solid fa-arrow-right text-[10px] group-hover/btn:translate-x-1 transition-transform"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RestaurantsComponent implements OnInit {
  restaurants: Restaurant[] = [];
  filteredRestaurants: Restaurant[] = [];
  loading: boolean = true;

  searchQuery: string = '';
  selectedCuisine: string = 'All';
  sortBy: string = 'rating';
  openOnly: boolean = false;

  cuisineOptions: string[] = ['All', 'Italian', 'French', 'Japanese', 'Burgers', 'Woodfired'];

  constructor(private restaurantService: RestaurantService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['cuisine']) {
        this.selectedCuisine = params['cuisine'];
      }
      if (params['search']) {
        this.searchQuery = params['search'];
      }
      this.loadRestaurants();
    });
  }

  loadRestaurants(): void {
    this.loading = true;
    this.restaurantService.getRestaurants().subscribe({
      next: res => {
        this.loading = false;
        if (res.success && res.data) {
          this.restaurants = res.data;
          this.applyFilters();
        }
      },
      error: err => {
        this.loading = false;
        console.error('Failed to load restaurants:', err);
      }
    });
  }

  applyFilters(): void {
    let list = [...this.restaurants];

    // Open now filter
    if (this.openOnly) {
      list = list.filter(r => r.isOpen);
    }

    // Cuisine filter
    if (this.selectedCuisine !== 'All') {
      list = list.filter(r => r.cuisine.toLowerCase().includes(this.selectedCuisine.toLowerCase()));
    }

    // Search query
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      list = list.filter(r => 
        r.name.toLowerCase().includes(q) ||
        r.cuisine.toLowerCase().includes(q) ||
        r.city.toLowerCase().includes(q) ||
        (r.description && r.description.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (this.sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (this.sortBy === 'time') {
      list.sort((a, b) => a.avgDeliveryTimeMinutes - b.avgDeliveryTimeMinutes);
    } else if (this.sortBy === 'fee') {
      list.sort((a, b) => a.deliveryFee - b.deliveryFee);
    } else if (this.sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    this.filteredRestaurants = list;
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedCuisine = 'All';
    this.sortBy = 'rating';
    this.openOnly = false;
    this.applyFilters();
  }
}
