import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AdminService } from '../../services/admin.service';
import { User } from '../../models/auth.models';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="sticky top-0 z-50 h-[76px] flex items-center bg-[#090909]/95 backdrop-blur-md border-b border-[#242424]">
      <div class="w-full max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        <!-- Brand & Platform Admin Badge -->
        <div class="flex items-center gap-3 sm:gap-4">
          <a routerLink="/admin-portal/dashboard" class="flex items-center gap-2 group">
            <span class="text-2xl font-extrabold text-white tracking-tight group-hover:opacity-90 transition-opacity">
              UrbanBite
            </span>
          </a>
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-gold/15 text-gold border border-gold/30 text-[10px] font-extrabold uppercase tracking-widest">
            <i class="fa-solid fa-shield-halved text-[9px]"></i> Admin Portal
          </span>
        </div>

        <!-- Center Main Navigation Links (Gold Active Style) -->
        <nav class="hidden md:flex items-center gap-2">
          <a routerLink="/admin-portal/dashboard" 
             routerLinkActive="!bg-gold !text-black hover:!text-black hover:!bg-gold-light font-extrabold shadow-md [&>*]:!text-black" 
             [routerLinkActiveOptions]="{exact: true}"
             class="flex items-center gap-2 px-4 py-2 text-xs font-bold tracking-[1.5px] uppercase text-neutral-400 hover:text-white hover:bg-[#161616] rounded transition-all cursor-pointer">
            <i class="fa-solid fa-chart-pie text-xs"></i>
            <span>Dashboard</span>
          </a>

          <a routerLink="/admin-portal/restaurants" 
             routerLinkActive="!bg-gold !text-black hover:!text-black hover:!bg-gold-light font-extrabold shadow-md [&>*]:!text-black"
             class="flex items-center gap-2 px-4 py-2 text-xs font-bold tracking-[1.5px] uppercase text-neutral-400 hover:text-white hover:bg-[#161616] rounded transition-all cursor-pointer">
            <i class="fa-solid fa-store text-xs"></i>
            <span>Restaurants</span>
          </a>

          <a routerLink="/admin-portal/customers" 
             routerLinkActive="!bg-gold !text-black hover:!text-black hover:!bg-gold-light font-extrabold shadow-md [&>*]:!text-black"
             class="flex items-center gap-2 px-4 py-2 text-xs font-bold tracking-[1.5px] uppercase text-neutral-400 hover:text-white hover:bg-[#161616] rounded transition-all cursor-pointer">
            <i class="fa-solid fa-users text-xs"></i>
            <span>Users</span>
          </a>

          <a routerLink="/admin-portal/orders" 
             routerLinkActive="!bg-gold !text-black hover:!text-black hover:!bg-gold-light font-extrabold shadow-md [&>*]:!text-black"
             class="flex items-center gap-2 px-4 py-2 text-xs font-bold tracking-[1.5px] uppercase text-neutral-400 hover:text-white hover:bg-[#161616] rounded transition-all cursor-pointer">
            <i class="fa-solid fa-receipt text-xs"></i>
            <span>Orders</span>
          </a>

          <a routerLink="/admin-portal/profile" 
             routerLinkActive="!bg-gold !text-black hover:!text-black hover:!bg-gold-light font-extrabold shadow-md [&>*]:!text-black"
             class="flex items-center gap-2 px-4 py-2 text-xs font-bold tracking-[1.5px] uppercase text-neutral-400 hover:text-white hover:bg-[#161616] rounded transition-all cursor-pointer">
            <i class="fa-solid fa-user-shield text-xs"></i>
            <span>Profile</span>
          </a>
        </nav>

        <!-- Right Quick Controls & Profile -->
        <div class="flex items-center gap-3">
          
          <!-- User Dropdown & Profile (Exact Match to Restaurant & Delivery Navbars) -->
          <div class="relative user-dropdown-container">
            <button (click)="toggleDropdown($event)" class="flex items-center gap-2.5 px-3 py-1.5 rounded border border-[#242424] hover:border-neutral-500 bg-[#141414] text-white transition-all cursor-pointer">
              <div class="w-6 h-6 rounded bg-gold/20 text-gold flex items-center justify-center font-bold text-xs border border-gold/30">
                {{ userInitials }}
              </div>
              <span class="hidden md:inline text-xs font-semibold max-w-[120px] truncate text-neutral-200">
                {{ currentUser?.fullName || 'Super Administrator' }}
              </span>
              <i class="fa-solid fa-chevron-down text-[10px] text-neutral-400"></i>
            </button>

            <!-- Dropdown Menu -->
            <div *ngIf="dropdownOpen" class="absolute right-0 top-12 w-60 bg-[#141414] border border-[#282828] rounded shadow-2xl py-2 z-50 text-xs animate-fadeIn">
              <div class="px-4 py-2.5 border-b border-[#242424]">
                <p class="font-bold text-white truncate">{{ currentUser?.fullName || 'Super Administrator' }}</p>
                <p class="text-[10px] text-neutral-400 truncate">{{ currentUser?.email }}</p>
                <div class="mt-1 flex items-center gap-2">
                  <span class="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-gold/15 text-gold border border-gold/30">
                    Executive Admin
                  </span>
                  <span class="text-[10px] font-semibold text-emerald-400">
                    Full Clearance
                  </span>
                </div>
              </div>

              <a routerLink="/admin-portal/dashboard" (click)="dropdownOpen = false" class="flex items-center gap-2.5 px-4 py-2 text-neutral-300 hover:text-white hover:bg-[#1c1c1c] transition-colors">
                <i class="fa-solid fa-chart-pie text-gold w-4"></i> Dashboard
              </a>

              <a routerLink="/admin-portal/restaurants" (click)="dropdownOpen = false" class="flex items-center gap-2.5 px-4 py-2 text-neutral-300 hover:text-white hover:bg-[#1c1c1c] transition-colors">
                <i class="fa-solid fa-store text-gold w-4"></i> Restaurant Management
              </a>

              <a routerLink="/admin-portal/customers" (click)="dropdownOpen = false" class="flex items-center gap-2.5 px-4 py-2 text-neutral-300 hover:text-white hover:bg-[#1c1c1c] transition-colors">
                <i class="fa-solid fa-users text-gold w-4"></i> User Management
              </a>

              <a routerLink="/admin-portal/orders" (click)="dropdownOpen = false" class="flex items-center gap-2.5 px-4 py-2 text-neutral-300 hover:text-white hover:bg-[#1c1c1c] transition-colors">
                <i class="fa-solid fa-receipt text-gold w-4"></i> Order Management
              </a>

              <a routerLink="/admin-portal/profile" (click)="dropdownOpen = false" class="flex items-center gap-2.5 px-4 py-2 text-neutral-300 hover:text-white hover:bg-[#1c1c1c] transition-colors">
                <i class="fa-solid fa-user-shield text-gold w-4"></i> Admin Profile & Security
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
        <a routerLink="/admin-portal/dashboard" 
           routerLinkActive="!bg-gold !text-black hover:!text-black font-extrabold px-3 py-2 rounded [&>*]:!text-black" 
           [routerLinkActiveOptions]="{exact: true}" 
           (click)="mobileMenuOpen = false" 
           class="flex items-center gap-3 py-2 text-sm font-bold text-neutral-300 hover:text-gold transition-colors">
          <i class="fa-solid fa-chart-pie w-5"></i> Dashboard
        </a>

        <a routerLink="/admin-portal/restaurants" 
           routerLinkActive="!bg-gold !text-black hover:!text-black font-extrabold px-3 py-2 rounded [&>*]:!text-black" 
           (click)="mobileMenuOpen = false" 
           class="flex items-center gap-3 py-2 text-sm font-bold text-neutral-300 hover:text-gold transition-colors">
          <i class="fa-solid fa-store w-5"></i> Restaurant Management
        </a>

        <a routerLink="/admin-portal/customers" 
           routerLinkActive="!bg-gold !text-black hover:!text-black font-extrabold px-3 py-2 rounded [&>*]:!text-black" 
           (click)="mobileMenuOpen = false" 
           class="flex items-center gap-3 py-2 text-sm font-bold text-neutral-300 hover:text-gold transition-colors">
          <i class="fa-solid fa-users w-5"></i> User Management
        </a>

        <a routerLink="/admin-portal/orders" 
           routerLinkActive="!bg-gold !text-black hover:!text-black font-extrabold px-3 py-2 rounded [&>*]:!text-black" 
           (click)="mobileMenuOpen = false" 
           class="flex items-center gap-3 py-2 text-sm font-bold text-neutral-300 hover:text-gold transition-colors">
          <i class="fa-solid fa-receipt w-5"></i> Order Management
        </a>

        <a routerLink="/admin-portal/profile" 
           routerLinkActive="!bg-gold !text-black hover:!text-black font-extrabold px-3 py-2 rounded [&>*]:!text-black" 
           (click)="mobileMenuOpen = false" 
           class="flex items-center gap-3 py-2 text-sm font-bold text-neutral-300 hover:text-gold transition-colors">
          <i class="fa-solid fa-user-shield w-5"></i> Admin Profile
        </a>

        <div class="border-t border-[#242424] pt-3 mt-1 flex justify-between items-center">
          <a routerLink="/" (click)="mobileMenuOpen = false" class="text-xs text-gold flex items-center gap-1.5 hover:underline">
            <i class="fa-solid fa-arrow-left text-[10px]"></i> View Customer Website
          </a>
          <button (click)="logout()" class="text-xs text-rose-400 hover:underline">
            Sign Out
          </button>
        </div>
      </div>
    </header>
  `
})
export class AdminNavbarComponent implements OnInit {
  currentUser: User | null = null;
  dropdownOpen = false;
  mobileMenuOpen = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private elementRef: ElementRef
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  get userInitials(): string {
    if (!this.currentUser?.fullName) return 'A';
    return this.currentUser.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.elementRef.nativeElement.querySelector('.user-dropdown-container')?.contains(event.target as Node);
    if (!clickedInside) {
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
