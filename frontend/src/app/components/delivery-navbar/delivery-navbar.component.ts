import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DeliveryService } from '../../services/delivery.service';
import { User } from '../../models/auth.models';

@Component({
  selector: 'app-delivery-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="sticky top-0 z-50 h-[76px] flex items-center bg-[#090909]/95 backdrop-blur-md border-b border-[#242424]">
      <div class="w-full max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        <!-- Brand & Delivery Partner Badge -->
        <div class="flex items-center gap-3 sm:gap-4">
          <a routerLink="/delivery-portal/dashboard" class="flex items-center gap-2 group">
            <span class="text-2xl font-extrabold text-white tracking-tight group-hover:opacity-90 transition-opacity">
              UrbanBite
            </span>
          </a>
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-gold/15 text-gold border border-gold/30 text-[10px] font-extrabold uppercase tracking-widest">
            <i class="fa-solid fa-motorcycle text-[9px]"></i> Delivery Partner
          </span>
        </div>

        <!-- Center Main Navigation Links (Matching Restaurant Portal Style) -->
        <nav class="hidden md:flex items-center gap-2">
          <a routerLink="/delivery-portal/dashboard" 
             routerLinkActive="!bg-gold !text-black hover:!text-black hover:!bg-gold-light font-extrabold shadow-md [&>*]:!text-black" 
             [routerLinkActiveOptions]="{exact: true}"
             class="flex items-center gap-2 px-4 py-2 text-xs font-bold tracking-[1.5px] uppercase text-neutral-400 hover:text-white hover:bg-[#161616] rounded transition-all cursor-pointer">
            <i class="fa-solid fa-chart-pie text-xs"></i>
            <span>Dashboard</span>
          </a>

          <a routerLink="/delivery-portal/orders" 
             [ngClass]="isDeliveriesActive() ? '!bg-gold !text-black hover:!text-black hover:!bg-gold-light font-extrabold shadow-md [&>*]:!text-black' : 'text-neutral-400 hover:text-white hover:bg-[#161616]'"
             class="flex items-center gap-2 px-4 py-2 text-xs font-bold tracking-[1.5px] uppercase rounded transition-all relative cursor-pointer">
            <i class="fa-solid fa-boxes-packing text-xs"></i>
            <span>Orders</span>
            <span *ngIf="activeCount > 0" class="px-1.5 py-0.2 text-[9px] font-black rounded-full"
                  [ngClass]="isDeliveriesActive() ? 'bg-black !text-gold border border-gold/40' : 'bg-gold text-black'">
              {{ activeCount }}
            </span>
            <span *ngIf="activeCount === 0 && availableCount > 0" class="px-1.5 py-0.2 text-[9px] font-black rounded-full animate-pulse"
                  [ngClass]="isDeliveriesActive() ? 'bg-black !text-gold border border-gold/40' : 'bg-gold text-black'">
              {{ availableCount }}
            </span>
          </a>

          <a routerLink="/delivery-portal/earnings" 
             routerLinkActive="!bg-gold !text-black hover:!text-black hover:!bg-gold-light font-extrabold shadow-md [&>*]:!text-black"
             class="flex items-center gap-2 px-4 py-2 text-xs font-bold tracking-[1.5px] uppercase text-neutral-400 hover:text-white hover:bg-[#161616] rounded transition-all cursor-pointer">
            <i class="fa-solid fa-wallet text-xs"></i>
            <span>Earnings</span>
          </a>

          <a routerLink="/delivery-portal/settings" 
             routerLinkActive="!bg-gold !text-black hover:!text-black hover:!bg-gold-light font-extrabold shadow-md [&>*]:!text-black"
             class="flex items-center gap-2 px-4 py-2 text-xs font-bold tracking-[1.5px] uppercase text-neutral-400 hover:text-white hover:bg-[#161616] rounded transition-all cursor-pointer">
            <i class="fa-solid fa-sliders text-xs"></i>
            <span>Settings</span>
          </a>
        </nav>

        <!-- Right Profile & Quick Controls -->
        <div class="flex items-center gap-3">
          
          <!-- Availability Status Toggle (Matching Restaurant Kitchen Status Button) -->
          <button (click)="toggleOnline()" 
                  class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold tracking-wider transition-all cursor-pointer border"
                  [ngClass]="isOnline ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400 hover:bg-emerald-950/80' : 'bg-neutral-900 border-neutral-700 text-neutral-400 hover:text-white'">
            <span class="w-2 h-2 rounded-full" [ngClass]="isOnline ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]' : 'bg-neutral-500'"></span>
            <span>{{ isOnline ? 'Online' : 'Offline' }}</span>
          </button>

          <!-- User Dropdown & Profile (Exact Match to Restaurant Navbar) -->
          <div class="relative user-dropdown-container">
            <button (click)="toggleDropdown($event)" class="flex items-center gap-2.5 px-3 py-1.5 rounded border border-[#242424] hover:border-neutral-500 bg-[#141414] text-white transition-all cursor-pointer">
              <div class="w-6 h-6 rounded bg-gold/20 text-gold flex items-center justify-center font-bold text-xs border border-gold/30">
                {{ userInitials }}
              </div>
              <span class="hidden md:inline text-xs font-semibold max-w-[120px] truncate text-neutral-200">
                {{ currentUser?.fullName || 'Delivery Partner' }}
              </span>
              <i class="fa-solid fa-chevron-down text-[10px] text-neutral-400"></i>
            </button>

            <!-- Dropdown Menu -->
            <div *ngIf="dropdownOpen" class="absolute right-0 top-12 w-56 bg-[#141414] border border-[#282828] rounded shadow-2xl py-2 z-50 text-xs animate-fadeIn">
              <div class="px-4 py-2.5 border-b border-[#242424]">
                <p class="font-bold text-white truncate">{{ currentUser?.fullName || 'Delivery Partner' }}</p>
                <p class="text-[10px] text-neutral-400 truncate">{{ currentUser?.email }}</p>
                <div class="mt-1 flex items-center gap-2">
                  <span class="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-gold/15 text-gold border border-gold/30">
                    Delivery Partner
                  </span>
                  <span class="text-[10px] font-semibold" [ngClass]="isOnline ? 'text-emerald-400' : 'text-neutral-500'">
                    {{ isOnline ? '● Online Shift' : '○ Offline' }}
                  </span>
                </div>
              </div>

              <a routerLink="/delivery-portal/dashboard" (click)="dropdownOpen = false" class="flex items-center gap-2.5 px-4 py-2 text-neutral-300 hover:text-white hover:bg-[#1c1c1c] transition-colors">
                <i class="fa-solid fa-chart-pie text-gold w-4"></i> Dashboard
              </a>

              <a routerLink="/delivery-portal/orders" (click)="dropdownOpen = false" class="flex items-center justify-between px-4 py-2 text-neutral-300 hover:text-white hover:bg-[#1c1c1c] transition-colors">
                <span class="flex items-center gap-2.5"><i class="fa-solid fa-boxes-packing text-gold w-4"></i> Orders</span>
                <span *ngIf="activeCount > 0 || availableCount > 0" class="px-1.5 py-0.2 rounded-full text-[9px] bg-gold text-black font-extrabold">{{ activeCount || availableCount }}</span>
              </a>

              <a routerLink="/delivery-portal/earnings" (click)="dropdownOpen = false" class="flex items-center gap-2.5 px-4 py-2 text-neutral-300 hover:text-white hover:bg-[#1c1c1c] transition-colors">
                <i class="fa-solid fa-wallet text-gold w-4"></i> Earnings & Payouts
              </a>

              <a routerLink="/delivery-portal/settings" (click)="dropdownOpen = false" class="flex items-center gap-2.5 px-4 py-2 text-neutral-300 hover:text-white hover:bg-[#1c1c1c] transition-colors">
                <i class="fa-solid fa-sliders text-gold w-4"></i> Settings & Vehicle
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
      <div *ngIf="mobileMenuOpen" class="md:hidden absolute top-[76px] left-0 w-full bg-[#0d0d0d] border-b border-[#242424] px-6 py-4 flex flex-col gap-2 z-50 shadow-2xl animate-fadeIn">
        <div class="flex items-center justify-between pb-3 mb-1 border-b border-[#242424]">
          <span class="text-xs font-bold text-neutral-400 uppercase tracking-wider">Status:</span>
          <button (click)="toggleOnline()" 
                  class="flex items-center gap-2 px-3 py-1 rounded text-xs font-bold tracking-wider border"
                  [ngClass]="isOnline ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400' : 'bg-neutral-900 border-neutral-700 text-neutral-400'">
            <span class="w-2 h-2 rounded-full" [ngClass]="isOnline ? 'bg-emerald-400' : 'bg-neutral-500'"></span>
            <span>{{ isOnline ? 'Online' : 'Offline' }}</span>
          </button>
        </div>

        <a routerLink="/delivery-portal/dashboard" 
           routerLinkActive="!bg-gold !text-black hover:!text-black font-extrabold px-3 py-2 rounded [&>*]:!text-black" 
           [routerLinkActiveOptions]="{exact: true}" 
           (click)="mobileMenuOpen = false" 
           class="flex items-center gap-3 py-2 text-sm font-bold text-neutral-300 hover:text-gold transition-colors">
          <i class="fa-solid fa-chart-pie w-5"></i> Dashboard
        </a>

        <a routerLink="/delivery-portal/orders" 
           [ngClass]="isDeliveriesActive() ? '!bg-gold !text-black hover:!text-black font-extrabold px-3 py-2 rounded [&>*]:!text-black' : 'text-neutral-300 hover:text-gold'" 
           (click)="mobileMenuOpen = false" 
           class="flex items-center justify-between py-2 text-sm font-bold transition-colors">
          <span class="flex items-center gap-3"><i class="fa-solid fa-boxes-packing w-5"></i> Orders & Deliveries</span>
          <span *ngIf="activeCount > 0" class="px-2 py-0.5 text-xs font-bold rounded-full bg-black !text-gold border border-gold/40">{{ activeCount }}</span>
          <span *ngIf="activeCount === 0 && availableCount > 0" class="px-2 py-0.5 text-xs font-bold rounded-full bg-black !text-gold border border-gold/40">{{ availableCount }}</span>
        </a>

        <a routerLink="/delivery-portal/earnings" 
           routerLinkActive="!bg-gold !text-black hover:!text-black font-extrabold px-3 py-2 rounded [&>*]:!text-black" 
           (click)="mobileMenuOpen = false" 
           class="flex items-center gap-3 py-2 text-sm font-bold text-neutral-300 hover:text-gold transition-colors">
          <i class="fa-solid fa-wallet w-5"></i> Earnings & Payouts
        </a>

        <a routerLink="/delivery-portal/settings" 
           routerLinkActive="!bg-gold !text-black hover:!text-black font-extrabold px-3 py-2 rounded [&>*]:!text-black" 
           (click)="mobileMenuOpen = false" 
           class="flex items-center gap-3 py-2 text-sm font-bold text-neutral-300 hover:text-gold transition-colors">
          <i class="fa-solid fa-sliders w-5"></i> Delivery Partner Settings
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
export class DeliveryNavbarComponent implements OnInit {
  currentUser: User | null = null;
  availableCount: number = 0;
  activeCount: number = 0;
  isOnline: boolean = true;
  dropdownOpen: boolean = false;
  mobileMenuOpen: boolean = false;

  constructor(
    private authService: AuthService,
    private deliveryService: DeliveryService,
    private router: Router,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(u => this.currentUser = u);
    this.loadCounts();
  }

  loadCounts(): void {
    this.deliveryService.getAvailableOrders().subscribe({
      next: res => {
        if (res.success && res.data) {
          this.availableCount = res.data.length;
        }
      }
    });

    this.deliveryService.getTasks().subscribe({
      next: res => {
        if (res.success && res.data) {
          this.activeCount = res.data.filter(t => t.status !== 'DELIVERED' && t.status !== 'DECLINED').length;
        }
      }
    });
  }

  toggleOnline(): void {
    this.isOnline = !this.isOnline;
  }

  get userInitials(): string {
    if (!this.currentUser?.fullName) return 'D';
    return this.currentUser.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  isDeliveriesActive(): boolean {
    return this.router.url.startsWith('/delivery-portal/orders') ||
           this.router.url.startsWith('/delivery-portal/requests') ||
           this.router.url.startsWith('/delivery-portal/active') ||
           this.router.url.startsWith('/delivery-portal/history') ||
           this.router.url.startsWith('/delivery-partner/orders') ||
           this.router.url.startsWith('/delivery-partner/requests') ||
           this.router.url.startsWith('/delivery-partner/active') ||
           this.router.url.startsWith('/delivery-partner/history') ||
           this.router.url.startsWith('/delivery/orders') ||
           this.router.url.startsWith('/delivery/requests') ||
           this.router.url.startsWith('/delivery/active') ||
           this.router.url.startsWith('/delivery/history');
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
