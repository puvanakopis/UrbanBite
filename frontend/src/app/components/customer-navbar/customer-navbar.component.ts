import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { User } from '../../models/auth.models';

@Component({
  selector: 'app-customer-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="sticky top-0 z-50 h-[76px] flex items-center bg-[#090909]/95 backdrop-blur-md border-b border-[#242424]">
      <div class="w-full max-w-7xl mx-auto px-6 flex items-center justify-between">
        <!-- Logo -->
        <a routerLink="/" class="text-2xl font-extrabold text-white tracking-tight hover:opacity-90 transition-opacity">
          UrbanBite
        </a>

        <!-- Main Navigation Links -->
        <nav class="hidden md:flex items-center gap-8">
          <a routerLink="/" routerLinkActive="text-white after:w-full" [routerLinkActiveOptions]="{exact: true}" 
             class="relative text-xs font-bold tracking-[2px] uppercase text-neutral-400 hover:text-white transition-colors py-1 after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1.5px] after:bg-white after:transition-all">
            HOME
          </a>
       
          <a routerLink="/restaurants" routerLinkActive="text-white after:w-full"
             class="relative text-xs font-bold tracking-[2px] uppercase text-neutral-400 hover:text-white transition-colors py-1 after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1.5px] after:bg-white after:transition-all">
            RESTAURANTS
          </a>
          <a routerLink="/contact" routerLinkActive="text-white after:w-full"
             class="relative text-xs font-bold tracking-[2px] uppercase text-neutral-400 hover:text-white transition-colors py-1 after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1.5px] after:bg-white after:transition-all">
            CONTACT
          </a>
          <a routerLink="/about" routerLinkActive="text-white after:w-full"
             class="relative text-xs font-bold tracking-[2px] uppercase text-neutral-400 hover:text-white transition-colors py-1 after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1.5px] after:bg-white after:transition-all">
            ABOUT
          </a>
        </nav>

        <!-- Right Action Items -->
        <div class="flex items-center gap-3 md:gap-4">
          <!-- Role Hub quick links for partners/admin -->
          <ng-container *ngIf="currentUser">
            <a *ngIf="currentUser.role === 'ROLE_RESTAURANT_OWNER'" routerLink="/restaurant-portal" 
               class="flex items-center gap-1.5 text-[11px] font-bold tracking-wider px-3 py-1.5 rounded bg-gold/15 text-gold border border-gold/40 hover:bg-gold hover:text-black transition-all">
              <i class="fa-solid fa-utensils"></i> <span class="hidden sm:inline">RESTAURANT PARTNER</span>
            </a>
            <a *ngIf="currentUser.role === 'ROLE_DELIVERY_PARTNER'" routerLink="/delivery-portal" 
               class="flex items-center gap-1.5 text-[11px] font-bold tracking-wider px-3 py-1.5 rounded bg-gold/15 text-gold border border-gold/40 hover:bg-gold hover:text-black transition-all">
              <i class="fa-solid fa-motorcycle"></i> <span class="hidden sm:inline">DELIVERY PARTNER</span>
            </a>
            <a *ngIf="currentUser.role === 'ROLE_ADMIN'" routerLink="/admin-portal" 
               class="flex items-center gap-1.5 text-[11px] font-bold tracking-wider px-3 py-1.5 rounded bg-gold/15 text-gold border border-gold/40 hover:bg-gold hover:text-black transition-all">
              <i class="fa-solid fa-shield-halved"></i> <span class="hidden sm:inline">ADMIN CONSOLE</span>
            </a>
          </ng-container>

          <!-- Guest Dropdown & Sign In -->
          <ng-container *ngIf="!currentUser">
            <a routerLink="/login" class="px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-white border border-neutral-700 rounded hover:border-white hover:bg-white/5 transition-all">
              SIGN IN
            </a>

            <div class="relative dropdown-container">
              <button (click)="toggleMenu($event)" class="relative flex items-center gap-2 border border-[#242424] hover:border-white rounded px-3 py-2 text-white transition-colors cursor-pointer bg-transparent text-xs font-bold">
                <i class="fa-solid fa-bars text-neutral-400"></i>
                <span class="hidden sm:inline">MENU</span>
                <span *ngIf="cartCount > 0" class="bg-white text-black text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                  {{ cartCount }}
                </span>
                <i class="fa-solid fa-chevron-down text-[10px] text-neutral-400"></i>
              </button>

              <div *ngIf="menuOpen" class="absolute right-0 top-12 w-60 bg-[#141414] border border-[#333] rounded shadow-2xl py-2 z-50 animate-fadeIn">
                <!-- SIGN IN / Account -->
                <a routerLink="/login" (click)="closeMenu()" 
                   class="flex items-center justify-between px-4 py-2.5 text-xs text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors">
                  <span class="flex items-center gap-2.5">
                    <i class="fa-regular fa-user w-4 text-center text-gold"></i> Account
                  </span>
                  <span class="text-[10px] text-neutral-400 font-semibold">Sign In</span>
                </a>

                <!-- CART -->
                <a routerLink="/cart" (click)="closeMenu()" 
                   class="flex items-center justify-between px-4 py-2.5 text-xs text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors">
                  <span class="flex items-center gap-2.5">
                    <i class="fa-solid fa-bag-shopping w-4 text-center text-gold"></i> Cart
                  </span>
                  <span *ngIf="cartCount > 0" class="bg-white text-black text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                    {{ cartCount }} {{ cartCount === 1 ? 'item' : 'items' }}
                  </span>
                  <span *ngIf="cartCount === 0" class="text-[10px] text-neutral-500">Empty</span>
                </a>

                <!-- SIGN IN / Orders -->
                <a routerLink="/login" (click)="closeMenu()" 
                   class="flex items-center justify-between px-4 py-2.5 text-xs text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors">
                  <span class="flex items-center gap-2.5">
                    <i class="fa-solid fa-receipt w-4 text-center text-gold"></i> Orders
                  </span>
                  <span class="text-[10px] text-neutral-400 font-semibold">Sign In</span>
                </a>

                <!-- SIGN IN / SETTINGS -->
                <a routerLink="/login" (click)="closeMenu()" 
                   class="flex items-center justify-between px-4 py-2.5 text-xs text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors">
                  <span class="flex items-center gap-2.5">
                    <i class="fa-solid fa-gear w-4 text-center text-gold"></i> Settings
                  </span>
                  <span class="text-[10px] text-neutral-400 font-semibold">Sign In</span>
                </a>

                <div class="border-t border-[#242424] my-1"></div>

                <a routerLink="/register" (click)="closeMenu()" 
                   class="flex items-center gap-2.5 px-4 py-2.5 text-xs text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors">
                  <i class="fa-solid fa-user-plus w-4 text-center text-gold"></i> Create Account
                </a>
              </div>
            </div>
          </ng-container>

          <!-- Authenticated User Dropdown with Orders and Cart -->
          <ng-container *ngIf="currentUser">
            <div class="relative dropdown-container">
              <button (click)="toggleMenu($event)" class="flex items-center gap-2 border border-[#242424] hover:border-white rounded px-3 py-1.5 text-white transition-colors cursor-pointer bg-transparent">
                <span class="relative flex items-center justify-center">
                  <span class="w-6 h-6 rounded-full bg-gold text-black font-extrabold text-xs flex items-center justify-center">
                    {{ currentUser.fullName.charAt(0) }}
                  </span>
                  <span *ngIf="cartCount > 0" class="absolute -top-1.5 -right-1.5 bg-white text-black text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow">
                    {{ cartCount }}
                  </span>
                </span>
                <span class="text-xs font-semibold max-w-[80px] sm:max-w-none truncate">{{ currentUser.fullName.split(' ')[0] }}</span>
                <i class="fa-solid fa-chevron-down text-[10px] text-neutral-400"></i>
              </button>

              <div *ngIf="menuOpen" class="absolute right-0 top-12 w-60 bg-[#141414] border border-[#333] rounded shadow-2xl py-2 z-50 animate-fadeIn">
                <!-- User Profile Header -->
                <div class="px-4 py-2.5 border-b border-[#242424]">
                  <p class="text-white text-xs font-bold truncate">{{ currentUser.fullName }}</p>
                  <p class="text-neutral-400 text-[11px] truncate">{{ currentUser.email }}</p>
                  <span class="inline-block mt-1 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-gold/15 text-gold border border-gold/30">
                    {{ formatRole(currentUser.role) }}
                  </span>
                </div>

                <!-- Account LINK -->
                <a routerLink="/account" (click)="closeMenu()" 
                   class="flex items-center justify-between px-4 py-2.5 text-xs text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors">
                  <span class="flex items-center gap-2.5">
                    <i class="fa-regular fa-user w-4 text-center text-gold"></i> Account
                  </span>
                  <span class="text-[10px] text-neutral-400 font-semibold">Profile</span>
                </a>

                <!-- CART LINK -->
                <a routerLink="/cart" (click)="closeMenu()" 
                   class="flex items-center justify-between px-4 py-2.5 text-xs text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors">
                  <span class="flex items-center gap-2.5">
                    <i class="fa-solid fa-bag-shopping w-4 text-center text-gold"></i> Cart
                  </span>
                  <span *ngIf="cartCount > 0" class="bg-white text-black text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                    {{ cartCount }} {{ cartCount === 1 ? 'item' : 'items' }}
                  </span>
                  <span *ngIf="cartCount === 0" class="text-[10px] text-neutral-500">Empty</span>
                </a>

                <!-- Orders LINK -->
                <a routerLink="/order" (click)="closeMenu()" 
                   class="flex items-center justify-between px-4 py-2.5 text-xs text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors">
                  <span class="flex items-center gap-2.5">
                    <i class="fa-solid fa-receipt w-4 text-center text-gold"></i> Orders
                  </span>
                  <span class="text-[10px] text-neutral-400 font-semibold">Track & History</span>
                </a>

                <!-- SETTINGS LINK -->
                <a routerLink="/settings" (click)="closeMenu()" 
                   class="flex items-center justify-between px-4 py-2.5 text-xs text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors">
                  <span class="flex items-center gap-2.5">
                    <i class="fa-solid fa-gear w-4 text-center text-gold"></i> Settings
                  </span>
                  <span class="text-[10px] text-neutral-400 font-semibold">Preferences</span>
                </a>

                <!-- Operational Role Management Links -->
                <a *ngIf="currentUser.role === 'ROLE_RESTAURANT_OWNER'" routerLink="/restaurant-portal" (click)="closeMenu()" 
                   class="flex items-center gap-2.5 px-4 py-2.5 text-xs text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors">
                  <i class="fa-solid fa-store w-4 text-center text-gold"></i> Restaurant Partner
                </a>
                <a *ngIf="currentUser.role === 'ROLE_DELIVERY_PARTNER'" routerLink="/delivery-portal" (click)="closeMenu()" 
                   class="flex items-center gap-2.5 px-4 py-2.5 text-xs text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors">
                  <i class="fa-solid fa-motorcycle w-4 text-center text-gold"></i> Delivery Partner
                </a>
                <a *ngIf="currentUser.role === 'ROLE_ADMIN'" routerLink="/admin-portal/dashboard" (click)="closeMenu()" 
                   class="flex items-center gap-2.5 px-4 py-2.5 text-xs text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors">
                  <i class="fa-solid fa-shield-halved w-4 text-center text-gold"></i> Admin Portal
                </a>

                <div class="border-t border-[#242424] my-1"></div>

                <button (click)="logout()" class="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-xs text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors">
                  <i class="fa-solid fa-arrow-right-from-bracket w-4 text-center"></i> Sign Out
                </button>
              </div>
            </div>
          </ng-container>
        </div>
      </div>
    </header>
  `
})
export class CustomerNavbarComponent implements OnInit {
  currentUser: User | null = null;
  cartCount: number = 0;
  menuOpen: boolean = false;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private elementRef: ElementRef
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(u => this.currentUser = u);
    this.cartService.cartItems$.subscribe(items => {
      this.cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
    });
  }

  toggleMenu(event: Event): void {
    event.stopPropagation();
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  logout(): void {
    this.closeMenu();
    this.authService.logout();
  }

  formatRole(role?: string): string {
    if (!role) return '';
    switch (role) {
      case 'ROLE_ADMIN': return 'Administrator';
      case 'ROLE_RESTAURANT_OWNER': return 'Restaurant Partner';
      case 'ROLE_DELIVERY_PARTNER': return 'Delivery Partner';
      case 'ROLE_CUSTOMER': return 'Patron';
      default: return role.replace('ROLE_', '');
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeMenu();
    }
  }
}
