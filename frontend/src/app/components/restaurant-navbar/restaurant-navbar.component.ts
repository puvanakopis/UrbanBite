import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RestaurantService } from '../../services/restaurant.service';
import { OrderService } from '../../services/order.service';
import { Restaurant } from '../../models/restaurant.models';
import { User } from '../../models/auth.models';

@Component({
  selector: 'app-restaurant-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="sticky top-0 z-50 h-[76px] flex items-center bg-[#090909]/95 backdrop-blur-md border-b border-[#242424]">
      <div class="w-full max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        <!-- Brand & Partner Badge -->
        <div class="flex items-center gap-3 sm:gap-4">
          <a routerLink="/restaurant-portal/dashboard" class="flex items-center gap-2 group">
            <span class="text-2xl font-extrabold text-white tracking-tight group-hover:opacity-90 transition-opacity">
              UrbanBite
            </span>
          </a>
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-gold/15 text-gold border border-gold/30 text-[10px] font-extrabold uppercase tracking-widest">
            <i class="fa-solid fa-utensils text-[9px]"></i> Restaurant Partner
          </span>
        </div>

        <!-- Center Main Navigation Links (Customer UI Gold Style) -->
        <nav class="hidden md:flex items-center gap-2">
          <a routerLink="/restaurant-portal/dashboard" 
             routerLinkActive="!bg-gold !text-black hover:!text-black hover:!bg-gold-light font-extrabold shadow-md [&>*]:!text-black" 
             [routerLinkActiveOptions]="{exact: true}"
             class="flex items-center gap-2 px-4 py-2 text-xs font-bold tracking-[1.5px] uppercase text-neutral-400 hover:text-white hover:bg-[#161616] rounded transition-all cursor-pointer">
            <i class="fa-solid fa-chart-pie text-xs"></i>
            <span>Dashboard</span>
          </a>

          <a routerLink="/restaurant-portal/orders" 
             routerLinkActive="!bg-gold !text-black hover:!text-black hover:!bg-gold-light font-extrabold shadow-md [&>*]:!text-black"
             class="flex items-center gap-2 px-4 py-2 text-xs font-bold tracking-[1.5px] uppercase text-neutral-400 hover:text-white hover:bg-[#161616] rounded transition-all relative cursor-pointer">
            <i class="fa-solid fa-bell-concierge text-xs"></i>
            <span>Orders</span>
            <span *ngIf="pendingOrdersCount > 0" class="px-1.5 py-0.2 text-[9px] font-black rounded-full bg-black !text-gold border border-gold/40 animate-pulse">
              {{ pendingOrdersCount }}
            </span>
          </a>

          <a routerLink="/restaurant-portal/menu" 
             routerLinkActive="!bg-gold !text-black hover:!text-black hover:!bg-gold-light font-extrabold shadow-md [&>*]:!text-black"
             class="flex items-center gap-2 px-4 py-2 text-xs font-bold tracking-[1.5px] uppercase text-neutral-400 hover:text-white hover:bg-[#161616] rounded transition-all cursor-pointer">
            <i class="fa-solid fa-utensils text-xs"></i>
            <span>Menu</span>
          </a>

          <a routerLink="/restaurant-portal/settings" 
             routerLinkActive="!bg-gold !text-black hover:!text-black hover:!bg-gold-light font-extrabold shadow-md [&>*]:!text-black"
             class="flex items-center gap-2 px-4 py-2 text-xs font-bold tracking-[1.5px] uppercase text-neutral-400 hover:text-white hover:bg-[#161616] rounded transition-all cursor-pointer">
            <i class="fa-solid fa-sliders text-xs"></i>
            <span>Settings</span>
          </a>
        </nav>

        <!-- Right Profile & Quick Controls -->
        <div class="flex items-center gap-3">

        <!-- User Dropdown & Profile -->
          <div class="relative user-dropdown-container">
            <button (click)="toggleDropdown($event)" class="flex items-center gap-2.5 px-3 py-1.5 rounded border border-[#242424] hover:border-neutral-500 bg-[#141414] text-white transition-all cursor-pointer">
              <div class="w-6 h-6 rounded bg-gold/20 text-gold flex items-center justify-center font-bold text-xs border border-gold/30">
                {{ userInitials }}
              </div>
              <span class="hidden md:inline text-xs font-semibold max-w-[120px] truncate text-neutral-200">
                {{ restaurant?.name || currentUser?.fullName || 'Manager' }}
              </span>
              <i class="fa-solid fa-chevron-down text-[10px] text-neutral-400"></i>
            </button>

            <!-- Dropdown Menu -->
            <div *ngIf="dropdownOpen" class="absolute right-0 top-12 w-56 bg-[#141414] border border-[#282828] rounded shadow-2xl py-2 z-50 text-xs animate-fadeIn">
              <div class="px-4 py-2.5 border-b border-[#242424]">
                <p class="font-bold text-white truncate">{{ currentUser?.fullName }}</p>
                <p class="text-[10px] text-neutral-400 truncate">{{ currentUser?.email }}</p>
              </div>

              <a routerLink="/restaurant-portal/dashboard" (click)="dropdownOpen = false" class="flex items-center gap-2.5 px-4 py-2 text-neutral-300 hover:text-white hover:bg-[#1c1c1c] transition-colors">
                <i class="fa-solid fa-chart-pie text-gold w-4"></i> Dashboard
              </a>

              <a routerLink="/restaurant-portal/orders" (click)="dropdownOpen = false" class="flex items-center gap-2.5 px-4 py-2 text-neutral-300 hover:text-white hover:bg-[#1c1c1c] transition-colors">
                <i class="fa-solid fa-bell-concierge text-gold w-4"></i> Orders
              </a>

              <a routerLink="/restaurant-portal/menu" (click)="dropdownOpen = false" class="flex items-center gap-2.5 px-4 py-2 text-neutral-300 hover:text-white hover:bg-[#1c1c1c] transition-colors">
                <i class="fa-solid fa-utensils text-gold w-4"></i> Menu Catalog
              </a>

              <a routerLink="/restaurant-portal/settings" (click)="dropdownOpen = false" class="flex items-center gap-2.5 px-4 py-2 text-neutral-300 hover:text-white hover:bg-[#1c1c1c] transition-colors">
                <i class="fa-solid fa-sliders text-gold w-4"></i> Settings & Hours
              </a>

              <button (click)="logout()" class="w-full text-left flex items-center gap-2.5 px-4 py-2 text-rose-400 hover:text-rose-300 hover:bg-[#1c1c1c] transition-colors cursor-pointer">
                <i class="fa-solid fa-arrow-right-from-bracket w-4"></i> Sign Out
              </button>
            </div>
          </div>

          <!-- Mobile Hamburger -->
          <button (click)="mobileMenuOpen = !mobileMenuOpen" class="md:hidden text-white p-2 text-base cursor-pointer">
            <i class="fa-solid" [ngClass]="mobileMenuOpen ? 'fa-xmark' : 'fa-bars'"></i>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation Drawer -->
      <div *ngIf="mobileMenuOpen" class="md:hidden absolute top-[76px] left-0 w-full bg-[#0d0d0d] border-b border-[#242424] px-6 py-4 flex flex-col gap-2 z-50 shadow-2xl">
        <a routerLink="/restaurant-portal/dashboard" 
           routerLinkActive="!bg-gold !text-black hover:!text-black font-extrabold px-3 py-2 rounded [&>*]:!text-black" 
           [routerLinkActiveOptions]="{exact: true}" 
           (click)="mobileMenuOpen = false" 
           class="flex items-center gap-3 py-2 text-sm font-bold text-neutral-300 hover:text-gold transition-colors">
          <i class="fa-solid fa-chart-pie w-5"></i> Dashboard
        </a>
        <a routerLink="/restaurant-portal/orders" 
           routerLinkActive="!bg-gold !text-black hover:!text-black font-extrabold px-3 py-2 rounded [&>*]:!text-black" 
           (click)="mobileMenuOpen = false" 
           class="flex items-center justify-between py-2 text-sm font-bold text-neutral-300 hover:text-gold transition-colors">
          <span class="flex items-center gap-3"><i class="fa-solid fa-bell-concierge w-5"></i> Order Management</span>
          <span *ngIf="pendingOrdersCount > 0" class="px-2 py-0.5 text-xs font-bold rounded-full bg-black !text-gold border border-gold/40">{{ pendingOrdersCount }}</span>
        </a>
        <a routerLink="/restaurant-portal/menu" 
           routerLinkActive="!bg-gold !text-black hover:!text-black font-extrabold px-3 py-2 rounded [&>*]:!text-black" 
           (click)="mobileMenuOpen = false" 
           class="flex items-center gap-3 py-2 text-sm font-bold text-neutral-300 hover:text-gold transition-colors">
          <i class="fa-solid fa-utensils w-5"></i> Menu Management
        </a>
        <a routerLink="/restaurant-portal/settings" 
           routerLinkActive="!bg-gold !text-black hover:!text-black font-extrabold px-3 py-2 rounded [&>*]:!text-black" 
           (click)="mobileMenuOpen = false" 
           class="flex items-center gap-3 py-2 text-sm font-bold text-neutral-300 hover:text-gold transition-colors">
          <i class="fa-solid fa-sliders w-5"></i> Restaurant Partner Settings
        </a>
        <div class="border-t border-[#242424] pt-3 mt-1 flex justify-between items-center">
          <a routerLink="/" (click)="mobileMenuOpen = false" class="text-xs text-gold flex items-center gap-1.5 hover:underline">
            <i class="fa-solid fa-arrow-left text-[10px]"></i> Customer Website
          </a>
          <button (click)="logout()" class="text-xs text-rose-400 font-bold hover:underline cursor-pointer">Sign Out</button>
        </div>
      </div>
    </header>
  `
})
export class RestaurantNavbarComponent implements OnInit {
  restaurant: Restaurant | null = null;
  currentUser: User | null = null;
  pendingOrdersCount: number = 0;
  dropdownOpen: boolean = false;
  mobileMenuOpen: boolean = false;

  constructor(
    private authService: AuthService,
    private restaurantService: RestaurantService,
    private orderService: OrderService,
    private router: Router,
    private elementRef: ElementRef
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(u => this.currentUser = u);
    this.loadRestaurant();
    this.loadPendingOrders();
  }

  loadRestaurant(): void {
    this.restaurantService.getMyRestaurant().subscribe({
      next: res => {
        if (res.success && res.data) {
          this.restaurant = res.data;
        }
      }
    });
  }

  loadPendingOrders(): void {
    this.orderService.getRestaurantOrders().subscribe({
      next: res => {
        if (res.success && res.data) {
          this.pendingOrdersCount = res.data.filter(o =>
            o.status === 'PLACED' || o.status === 'ACCEPTED' || o.status === 'PREPARING'
          ).length;
        }
      }
    });
  }

  get userInitials(): string {
    if (!this.currentUser?.fullName) return 'R';
    return this.currentUser.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (!this.elementRef.nativeElement.querySelector('.user-dropdown-container')?.contains(event.target as Node)) {
      this.dropdownOpen = false;
    }
  }

  logout(): void {
    this.dropdownOpen = false;
    this.mobileMenuOpen = false;
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
