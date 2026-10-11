import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { User } from '../../models/auth.models';

interface SidebarNavItem {
  label: string;
  sublabel: string;
  route: string;
  icon: string;
  badge?: number | null;
}

@Component({
  selector: 'app-user-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- DESKTOP SIDEBAR (lg and up) -->
    <aside class="hidden lg:block w-full">
      <div class="sticky top-28 bg-[#141414] border border-[#242424] rounded p-5 shadow-2xl space-y-6">
        
        <!-- User Profile Quick Snapshot -->
        <div class="pb-5 border-b border-[#242424]">
          <div class="flex items-center gap-3.5">
            <div class="w-12 h-12 rounded bg-gradient-to-br from-gold via-amber-400 to-amber-600 p-0.5 shadow-lg shrink-0">
              <div class="w-full h-full bg-[#111] rounded flex items-center justify-center">
                <span class="text-sm font-extrabold text-gold uppercase tracking-wider">
                  {{ userInitials }}
                </span>
              </div>
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-1.5">
                <span class="text-[9px] font-extrabold tracking-[1.5px] uppercase text-gold">PATRON PROFILE</span>
                <span *ngIf="currentUser" class="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              </div>
              <h4 class="text-sm font-bold text-white truncate leading-snug">
                {{ currentUser?.fullName || 'Guest Patron' }}
              </h4>
              <p class="text-[11px] text-neutral-400 truncate">
                {{ currentUser?.email || 'patron@urbanbite.com' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Navigation Menu -->
        <div class="space-y-1.5">
          <span class="text-[10px] font-bold uppercase tracking-[2px] text-neutral-400 px-3 block mb-2">
            NAVIGATION
          </span>

          <!-- Account -->
          <a routerLink="/account" 
             routerLinkActive="bg-[#1e1910] text-gold border-gold/60 shadow-md shadow-gold/5 font-semibold"
             [routerLinkActiveOptions]="{ exact: false }"
             class="group flex items-center justify-between px-3.5 py-3 rounded border border-transparent text-neutral-400 hover:text-white hover:bg-[#1a1a1a] transition-all cursor-pointer">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-8 h-8 rounded bg-[#0d0d0d] border border-[#262626] group-hover:border-[#383838] flex items-center justify-center shrink-0 text-neutral-400 group-hover:text-gold transition-colors">
                <i class="fa-regular fa-user text-xs"></i>
              </div>
              <div class="min-w-0">
                <span class="text-xs font-bold block leading-tight text-white group-hover:text-gold transition-colors">Account</span>
                <span class="text-[10px] text-neutral-400 block truncate">Profile & addresses</span>
              </div>
            </div>
            <i class="fa-solid fa-chevron-right text-[10px] text-neutral-400 group-hover:text-gold transition-transform group-hover:translate-x-0.5"></i>
          </a>

          <!-- Cart -->
          <a routerLink="/cart" 
             routerLinkActive="bg-[#1e1910] text-gold border-gold/60 shadow-md shadow-gold/5 font-semibold"
             [routerLinkActiveOptions]="{ exact: false }"
             class="group flex items-center justify-between px-3.5 py-3 rounded border border-transparent text-neutral-400 hover:text-white hover:bg-[#1a1a1a] transition-all cursor-pointer">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-8 h-8 rounded bg-[#0d0d0d] border border-[#262626] group-hover:border-[#383838] flex items-center justify-center shrink-0 text-neutral-400 group-hover:text-gold transition-colors relative">
                <i class="fa-solid fa-bag-shopping text-xs"></i>
              </div>
              <div class="min-w-0">
                <span class="text-xs font-bold block leading-tight text-white group-hover:text-gold transition-colors">Cart</span>
                <span class="text-[10px] text-neutral-400 block truncate">Your dining basket</span>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span *ngIf="cartCount > 0" 
                    class="bg-gold text-black text-[10px] font-extrabold px-2 py-0.5 rounded shadow-sm">
                {{ cartCount }}
              </span>
              <i class="fa-solid fa-chevron-right text-[10px] text-neutral-400 group-hover:text-gold transition-transform group-hover:translate-x-0.5"></i>
            </div>
          </a>

          <!-- Order -->
          <a routerLink="/order" 
             routerLinkActive="bg-[#1e1910] text-gold border-gold/60 shadow-md shadow-gold/5 font-semibold"
             [routerLinkActiveOptions]="{ exact: false }"
             class="group flex items-center justify-between px-3.5 py-3 rounded border border-transparent text-neutral-400 hover:text-white hover:bg-[#1a1a1a] transition-all cursor-pointer">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-8 h-8 rounded bg-[#0d0d0d] border border-[#262626] group-hover:border-[#383838] flex items-center justify-center shrink-0 text-neutral-400 group-hover:text-gold transition-colors">
                <i class="fa-solid fa-clock-rotate-left text-xs"></i>
              </div>
              <div class="min-w-0">
                <span class="text-xs font-bold block leading-tight text-white group-hover:text-gold transition-colors">Orders</span>
                <span class="text-[10px] text-neutral-400 block truncate">History & live tracking</span>
              </div>
            </div>
            <i class="fa-solid fa-chevron-right text-[10px] text-neutral-400 group-hover:text-gold transition-transform group-hover:translate-x-0.5"></i>
          </a>

          <!-- Settings -->
          <a routerLink="/settings" 
             routerLinkActive="bg-[#1e1910] text-gold border-gold/60 shadow-md shadow-gold/5 font-semibold"
             [routerLinkActiveOptions]="{ exact: false }"
             class="group flex items-center justify-between px-3.5 py-3 rounded border border-transparent text-neutral-400 hover:text-white hover:bg-[#1a1a1a] transition-all cursor-pointer">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-8 h-8 rounded bg-[#0d0d0d] border border-[#262626] group-hover:border-[#383838] flex items-center justify-center shrink-0 text-neutral-400 group-hover:text-gold transition-colors">
                <i class="fa-solid fa-gear text-xs"></i>
              </div>
              <div class="min-w-0">
                <span class="text-xs font-bold block leading-tight text-white group-hover:text-gold transition-colors">Settings</span>
                <span class="text-[10px] text-neutral-400 block truncate">Security & password</span>
              </div>
            </div>
            <i class="fa-solid fa-chevron-right text-[10px] text-neutral-400 group-hover:text-gold transition-transform group-hover:translate-x-0.5"></i>
          </a>

          <!-- Delivery Partner Hub Link (for delivery partner or admin) -->
          <a *ngIf="currentUser?.role === 'ROLE_DELIVERY_PARTNER' || currentUser?.role === 'ROLE_ADMIN'"
             routerLink="/delivery-portal" 
             class="group flex items-center justify-between px-3.5 py-3 rounded border border-gold/30 bg-gold/10 text-gold hover:bg-gold hover:text-black transition-all cursor-pointer">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-8 h-8 rounded bg-[#0d0d0d] border border-gold/40 flex items-center justify-center shrink-0 text-gold group-hover:text-black group-hover:bg-gold transition-colors">
                <i class="fa-solid fa-motorcycle text-xs"></i>
              </div>
              <div class="min-w-0">
                <span class="text-xs font-bold block leading-tight text-gold group-hover:text-black transition-colors">Delivery Partner Hub</span>
                <span class="text-[10px] text-neutral-400 group-hover:text-neutral-900 block truncate">Active tasks & dispatch</span>
              </div>
            </div>
            <i class="fa-solid fa-chevron-right text-[10px] text-gold group-hover:text-black transition-transform group-hover:translate-x-0.5"></i>
          </a>

          <!-- Restaurant Partner Hub Link (for restaurant owner or admin) -->
          <a *ngIf="currentUser?.role === 'ROLE_RESTAURANT_OWNER' || currentUser?.role === 'ROLE_ADMIN'"
             routerLink="/restaurant-portal" 
             class="group flex items-center justify-between px-3.5 py-3 rounded border border-gold/30 bg-gold/10 text-gold hover:bg-gold hover:text-black transition-all cursor-pointer">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-8 h-8 rounded bg-[#0d0d0d] border border-gold/40 flex items-center justify-center shrink-0 text-gold group-hover:text-black group-gold transition-colors">
                <i class="fa-solid fa-utensils text-xs"></i>
              </div>
              <div class="min-w-0">
                <span class="text-xs font-bold block leading-tight text-gold group-hover:text-black transition-colors">Restaurant Partner Hub</span>
                <span class="text-[10px] text-neutral-400 group-hover:text-neutral-900 block truncate">Orders, menu & kitchen</span>
              </div>
            </div>
            <i class="fa-solid fa-chevron-right text-[10px] text-gold group-hover:text-black transition-transform group-hover:translate-x-0.5"></i>
          </a>
        </div>

        <!-- Concierge Direct Helpline Footer -->
        <div class="pt-4 border-t border-[#242424] space-y-3">
          <div class="p-3 bg-[#0d0d0d] rounded border border-[#202020] text-[11px]">
            <div class="flex items-center gap-2 text-gold font-bold mb-1">
              <i class="fa-solid fa-headset text-xs"></i>
              <span>Private Concierge</span>
            </div>
            <p class="text-neutral-400 text-[10px] leading-relaxed">
              Assistance line on standby:
            </p>
            <a href="tel:+15550194400" class="text-white hover:text-gold font-semibold text-[11px] block mt-0.5 transition-colors">
              +1 (555) 019-4400
            </a>
          </div>

          <!-- Sign Out Button (if logged in) -->
          <button *ngIf="currentUser" 
                  (click)="logout()" 
                  class="w-full py-2.5 px-3 rounded bg-transparent hover:bg-rose-950/30 border border-[#262626] hover:border-rose-800/40 text-neutral-400 hover:text-rose-300 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2">
            <i class="fa-solid fa-arrow-right-from-bracket text-xs"></i>
            <span>Sign Out</span>
          </button>
        </div>

      </div>
    </aside>

    <!-- MOBILE & TABLET NAVIGATION BAR (below lg) -->
    <nav class="lg:hidden w-full mb-8">
      <div class="bg-[#141414] border border-[#242424] rounded p-2 shadow-xl">
        <div class="grid grid-cols-4 gap-1.5">
          
          <!-- Account Tab -->
          <a routerLink="/account" 
             routerLinkActive="!bg-gold !text-black hover:!text-black font-extrabold shadow-md [&>*]:!text-black"
             [routerLinkActiveOptions]="{ exact: false }"
             class="flex flex-col items-center justify-center py-2.5 px-1 rounded text-neutral-400 hover:text-white transition-all text-center">
            <i class="fa-regular fa-user text-sm mb-1"></i>
            <span class="text-[10px] uppercase font-bold tracking-wider leading-none">Account</span>
          </a>

          <!-- Cart Tab -->
          <a routerLink="/cart" 
             routerLinkActive="!bg-gold !text-black hover:!text-black font-extrabold shadow-md [&>*]:!text-black"
             [routerLinkActiveOptions]="{ exact: false }"
             class="relative flex flex-col items-center justify-center py-2.5 px-1 rounded text-neutral-400 hover:text-white transition-all text-center">
            <div class="relative">
              <i class="fa-solid fa-bag-shopping text-sm mb-1"></i>
              <span *ngIf="cartCount > 0" 
                    class="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[9px] font-extrabold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {{ cartCount }}
              </span>
            </div>
            <span class="text-[10px] uppercase font-bold tracking-wider leading-none">Cart</span>
          </a>

          <!-- Order Tab -->
          <a routerLink="/order" 
             routerLinkActive="!bg-gold !text-black hover:!text-black font-extrabold shadow-md [&>*]:!text-black"
             [routerLinkActiveOptions]="{ exact: false }"
             class="flex flex-col items-center justify-center py-2.5 px-1 rounded text-neutral-400 hover:text-white transition-all text-center">
            <i class="fa-solid fa-clock-rotate-left text-sm mb-1"></i>
            <span class="text-[10px] uppercase font-bold tracking-wider leading-none">Orders</span>
          </a>

          <!-- Settings Tab -->
          <a routerLink="/settings" 
             routerLinkActive="!bg-gold !text-black hover:!text-black font-extrabold shadow-md [&>*]:!text-black"
             [routerLinkActiveOptions]="{ exact: false }"
             class="flex flex-col items-center justify-center py-2.5 px-1 rounded text-neutral-400 hover:text-white transition-all text-center">
            <i class="fa-solid fa-gear text-sm mb-1"></i>
            <span class="text-[10px] uppercase font-bold tracking-wider leading-none">Settings</span>
          </a>

        </div>
      </div>
    </nav>
  `
})
export class UserSidebarComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  cartCount: number = 0;
  private subs = new Subscription();

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subs.add(
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
      })
    );

    this.subs.add(
      this.cartService.cartItems$.subscribe(items => {
        this.cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  get userInitials(): string {
    if (!this.currentUser || !this.currentUser.fullName) return 'UB';
    const names = this.currentUser.fullName.trim().split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
