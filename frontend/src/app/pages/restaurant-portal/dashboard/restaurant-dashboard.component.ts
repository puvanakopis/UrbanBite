import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RestaurantService } from '../../../services/restaurant.service';
import { OrderService } from '../../../services/order.service';
import { MenuService } from '../../../services/menu.service';
import { Restaurant, MenuCategory, MenuItem } from '../../../models/restaurant.models';
import { Order } from '../../../models/order.models';

@Component({
  selector: 'app-restaurant-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-[#090909] min-h-[90vh] py-12 sm:py-16 text-neutral-200">
      <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Loading State -->
        <div *ngIf="loading" class="bg-[#141414] border border-[#242424] rounded p-20 text-center">
          <div class="w-10 h-10 border-2 border-neutral-700 border-t-gold rounded-full animate-spin mx-auto mb-4"></div>
          <h3 class="text-base font-bold text-white mb-1">Loading Restaurant Dashboard</h3>
          <p class="text-xs text-neutral-400">Retrieving kitchen operational data and live metrics...</p>
        </div>

        <ng-container *ngIf="!loading && restaurant">
          <!-- Customer-Style Page Header -->
          <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-4 border-b border-[#242424]">
            <div>
              <span class="text-xs font-bold uppercase tracking-[2.5px] text-gold mb-2 block">
                PARTNER PORTAL & MANAGEMENT
              </span>
              <div class="flex items-center gap-3">
                <h1 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {{ restaurant.name }}
                </h1>
                <span class="px-2.5 py-1 text-[10px] font-bold tracking-wider rounded uppercase"
                      [ngClass]="restaurant.isOpen ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-400' : 'bg-rose-950/60 border border-rose-500/40 text-rose-400'">
                  <span class="inline-block w-1.5 h-1.5 rounded-full mr-1" [ngClass]="restaurant.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'"></span>
                  {{ restaurant.isOpen ? 'Kitchen Open' : 'Kitchen Closed' }}
                </span>
              </div>
            </div>

            <!-- Header Actions -->
            <div class="flex items-center gap-3">
              <button 
                (click)="toggleKitchenStatus()" 
                class="px-4 py-2 border rounded font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2"
                [ngClass]="restaurant.isOpen ? 'border-[#333] text-neutral-300 hover:border-white hover:bg-white/5' : 'bg-gold hover:bg-gold-light text-black border-gold'">
                <span class="w-2 h-2 rounded-full" [ngClass]="restaurant.isOpen ? 'bg-emerald-400 shadow-[0_0_8px_#38b000]' : 'bg-rose-500'"></span>
                <span>{{ restaurant.isOpen ? 'Close Kitchen' : 'Open Kitchen' }}</span>
              </button>

              <a routerLink="/restaurant-portal/orders" 
                 class="px-5 py-2.5 bg-gold hover:bg-gold-light text-black font-extrabold text-xs uppercase tracking-wider rounded transition-all cursor-pointer shadow-md flex items-center gap-2">
                <i class="fa-solid fa-bell-concierge"></i>
                <span>Live Orders</span>
              </a>
            </div>
          </div>

          <!-- Attention Banner for New Orders -->
          <div *ngIf="placedOrders.length > 0" class="mb-8 p-4 bg-gold/10 border border-gold/40 rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div class="flex items-center gap-3 text-gold">
              <div class="w-9 h-9 rounded bg-gold/20 flex items-center justify-center shrink-0">
                <i class="fa-solid fa-bell text-base animate-bounce"></i>
              </div>
              <div>
                <h4 class="font-bold text-sm text-white">Action Required: {{ placedOrders.length }} New Ticket{{ placedOrders.length > 1 ? 's' : '' }} Waiting</h4>
                <p class="text-xs text-neutral-300">New customer orders require immediate kitchen acceptance.</p>
              </div>
            </div>
            <a routerLink="/restaurant-portal/orders" class="px-4 py-2 bg-gold hover:bg-gold-light text-black font-bold text-xs uppercase tracking-wider rounded transition-all whitespace-nowrap shadow">
              Review Orders
            </a>
          </div>

          <!-- Metric Cards Strip -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <div class="bg-[#141414] border border-[#242424] rounded p-6 shadow-xl flex flex-col justify-between hover:border-neutral-700 transition-colors">
              <div class="flex justify-between items-start mb-3">
                <span class="text-[11px] font-bold tracking-wider text-neutral-400 uppercase">TOTAL ORDERS</span>
                <i class="fa-solid fa-receipt text-xs text-neutral-500"></i>
              </div>
              <span class="text-3xl font-extrabold text-white font-serif mb-1">{{ orders.length }}</span>
              <span class="text-xs text-neutral-500">Lifetime orders</span>
            </div>

            <div class="bg-[#141414] border border-[#242424] rounded p-6 shadow-xl flex flex-col justify-between hover:border-gold/40 transition-colors">
              <div class="flex justify-between items-start mb-3">
                <span class="text-[11px] font-bold tracking-wider text-neutral-400 uppercase">ACTIVE ORDERS</span>
                <i class="fa-solid fa-fire-burner text-xs text-gold"></i>
              </div>
              <span class="text-3xl font-extrabold text-gold font-serif mb-1">{{ activeOrdersCount }}</span>
              <span class="text-xs text-neutral-500">Awaiting prep / pickup</span>
            </div>

            <div class="bg-[#141414] border border-[#242424] rounded p-6 shadow-xl flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
              <div class="flex justify-between items-start mb-3">
                <span class="text-[11px] font-bold tracking-wider text-neutral-400 uppercase">GROSS REVENUE</span>
                <i class="fa-solid fa-dollar-sign text-xs text-emerald-400"></i>
              </div>
              <span class="text-3xl font-extrabold text-emerald-400 font-serif mb-1">&#36;{{ revenue | number:'1.2-2' }}</span>
              <span class="text-xs text-neutral-500">Delivered orders turnover</span>
            </div>

            <div class="bg-[#141414] border border-[#242424] rounded p-6 shadow-xl flex flex-col justify-between hover:border-neutral-700 transition-colors">
              <div class="flex justify-between items-start mb-3">
                <span class="text-[11px] font-bold tracking-wider text-neutral-400 uppercase">MENU ITEMS</span>
                <i class="fa-solid fa-utensils text-xs text-neutral-500"></i>
              </div>
              <span class="text-3xl font-extrabold text-white font-serif mb-1">{{ items.length }}</span>
              <span class="text-xs text-neutral-500">{{ categories.length }} active categories</span>
            </div>
          </div>

          <!-- Main Content 2-Column Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <!-- Recent Orders Feed (2 cols) -->
            <div class="lg:col-span-2 bg-[#141414] border border-[#242424] rounded p-6 sm:p-8 shadow-xl">
              <div class="flex justify-between items-center pb-5 border-b border-[#242424] mb-6">
                <div>
                  <span class="text-[10px] font-extrabold uppercase tracking-[2px] text-gold block mb-1">LIVE TICKETS</span>
                  <h3 class="text-xl font-bold text-white flex items-center gap-2">
                    Recent Incoming Orders
                  </h3>
                  <p class="text-xs text-neutral-400 mt-1">Review and manage incoming orders in real time.</p>
                </div>
                <a routerLink="/restaurant-portal/orders" class="text-xs font-bold text-gold hover:underline flex items-center gap-1.5">
                  <span>View All</span>
                  <i class="fa-solid fa-arrow-right text-[10px]"></i>
                </a>
              </div>

              <!-- Empty State -->
              <div *ngIf="recentOrders.length === 0" class="p-12 text-center text-neutral-500 text-xs">
                No orders placed yet. Orders will appear here automatically.
              </div>

              <!-- Orders List -->
              <div *ngIf="recentOrders.length > 0" class="space-y-3">
                <div *ngFor="let order of recentOrders" 
                     class="p-4 bg-[#0d0d0d] border border-[#242424] rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-neutral-700 transition-colors">
                  <div>
                    <div class="flex items-center gap-2.5 mb-1.5">
                      <span class="font-extrabold text-white text-xs">#{{ order.orderNumber }}</span>
                      <span class="text-[10px] font-bold px-2.5 py-0.5 rounded uppercase"
                            [ngClass]="{
                              'bg-gold/20 text-gold border border-gold/40': order.status === 'PLACED',
                              'bg-sky-500/20 text-sky-400 border border-sky-500/40': order.status === 'PREPARING',
                              'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40': order.status === 'READY_FOR_PICKUP' || order.status === 'DELIVERED',
                              'bg-rose-500/20 text-rose-400 border border-rose-500/40': order.status === 'REJECTED' || order.status === 'CANCELLED',
                              'bg-neutral-800 text-neutral-400 border border-neutral-700': order.status === 'ACCEPTED' || order.status === 'OUT_FOR_DELIVERY'
                            }">
                        {{ order.status.replace('_', ' ') }}
                      </span>
                      <span class="text-[11px] text-neutral-500">{{ order.createdAt | date:'shortTime' }}</span>
                    </div>
                    <p class="text-xs text-neutral-300">
                      <span class="font-semibold text-white">{{ order.customer?.fullName }}</span> • {{ order.items.length }} item{{ order.items.length > 1 ? 's' : '' }}
                    </p>
                  </div>

                  <div class="flex items-center gap-4 self-end sm:self-center">
                    <span class="font-extrabold text-white text-sm font-serif">&#36;{{ order.totalAmount | number:'1.2-2' }}</span>
                    <a routerLink="/restaurant-portal/orders" class="px-3.5 py-1.5 border border-neutral-700 hover:border-white hover:bg-white/5 text-neutral-300 text-[11px] font-bold uppercase tracking-wider rounded transition-all">
                      Manage
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quick Management Navigation Cards (1 col) -->
            <div class="space-y-4">
              <!-- Order Management Card -->
              <a routerLink="/restaurant-portal/orders" 
                 class="block p-6 bg-[#141414] border border-[#242424] hover:border-gold/50 rounded group transition-all shadow-xl">
                <div class="flex items-center gap-3.5">
                  <div class="w-10 h-10 rounded bg-gold/15 text-gold flex items-center justify-center border border-gold/30">
                    <i class="fa-solid fa-bell-concierge text-sm"></i>
                  </div>
                  <div>
                    <h4 class="text-sm font-bold text-white group-hover:text-gold transition-colors">Order Management</h4>
                    <p class="text-[11px] text-neutral-400">Accept, prepare & dispatch live tickets</p>
                  </div>
                </div>
              </a>

              <!-- Menu Management Card -->
              <a routerLink="/restaurant-portal/menu" 
                 class="block p-6 bg-[#141414] border border-[#242424] hover:border-white/40 rounded group transition-all shadow-xl">
                <div class="flex items-center gap-3.5">
                  <div class="w-10 h-10 rounded bg-[#1b1b1b] text-white flex items-center justify-center border border-neutral-700">
                    <i class="fa-solid fa-utensils text-sm"></i>
                  </div>
                  <div>
                    <h4 class="text-sm font-bold text-white group-hover:text-neutral-200 transition-colors">Menu Catalog</h4>
                    <p class="text-[11px] text-neutral-400">Add dishes, set prices & categories</p>
                  </div>
                </div>
              </a>

              <!-- Profile & Settings Card -->
              <a routerLink="/restaurant-portal/settings" 
                 class="block p-6 bg-[#141414] border border-[#242424] hover:border-white/40 rounded group transition-all shadow-xl">
                <div class="flex items-center gap-3.5">
                  <div class="w-10 h-10 rounded bg-[#1b1b1b] text-white flex items-center justify-center border border-neutral-700">
                    <i class="fa-solid fa-sliders text-sm"></i>
                  </div>
                  <div>
                    <h4 class="text-sm font-bold text-white group-hover:text-neutral-200 transition-colors">Profile & Settings</h4>
                    <p class="text-[11px] text-neutral-400">Hours, delivery fees & restaurant info</p>
                  </div>
                </div>
              </a>
            </div>
          </div>

          <!-- Menu Catalog Highlights -->
          <div class="bg-[#141414] border border-[#242424] rounded p-6 sm:p-8 shadow-xl">
            <div class="flex justify-between items-center pb-5 border-b border-[#242424] mb-6">
              <div>
                <span class="text-[10px] font-extrabold uppercase tracking-[2px] text-gold block mb-1">CATALOG PREVIEW</span>
                <h3 class="text-xl font-bold text-white">
                  Signature Menu Highlights
                </h3>
                <p class="text-xs text-neutral-400 mt-1">Featured dishes currently displayed on customer storefront.</p>
              </div>
              <a routerLink="/restaurant-portal/menu" class="text-xs font-bold text-gold hover:underline flex items-center gap-1.5">
                <span>Manage Menu</span>
                <i class="fa-solid fa-arrow-right text-[10px]"></i>
              </a>
            </div>

            <div *ngIf="items.length === 0" class="text-center py-10 text-xs text-neutral-500">
              No dishes added yet. <a routerLink="/restaurant-portal/menu" class="text-gold underline">Add dishes now</a>.
            </div>

            <div *ngIf="items.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div *ngFor="let it of items | slice:0:4" class="p-4 bg-[#0d0d0d] border border-[#242424] rounded flex flex-col justify-between hover:border-neutral-700 transition-colors">
                <div>
                  <img [src]="it.imageUrl || '/images/signature-steak.jpg'" class="w-full h-28 object-cover rounded mb-3 border border-[#242424]" />
                  <h4 class="font-bold text-white text-xs truncate">{{ it.name }}</h4>
                  <p class="text-[11px] text-neutral-400 line-clamp-2 mt-0.5">{{ it.description }}</p>
                </div>
                <div class="flex justify-between items-center mt-3 pt-2.5 border-t border-[#242424]">
                  <span class="text-xs font-extrabold text-white font-serif">&#36;{{ it.price | number:'1.2-2' }}</span>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded uppercase"
                        [ngClass]="it.isAvailable ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40' : 'bg-neutral-800 text-neutral-500'">
                    {{ it.isAvailable ? 'In Stock' : 'Out' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </ng-container>

        <!-- Fallback State if restaurant not found -->
        <div *ngIf="!loading && !restaurant" class="bg-[#141414] border border-[#242424] rounded p-16 text-center max-w-xl mx-auto shadow-2xl">
          <div class="w-16 h-16 rounded bg-[#1b1b1b] border border-[#2f2f2f] mx-auto flex items-center justify-center text-gold text-2xl mb-4">
            <i class="fa-solid fa-store"></i>
          </div>
          <span class="text-xs font-bold uppercase tracking-[2px] text-gold block mb-2">Notice</span>
          <h2 class="text-2xl font-bold text-white mb-2">No Restaurant Assigned</h2>
          <p class="text-xs text-neutral-400 max-w-md mx-auto mb-6">Your account is not currently linked to an active restaurant profile.</p>
          <a routerLink="/" class="px-6 py-2.5 bg-gold hover:bg-gold-light text-black font-extrabold text-xs uppercase tracking-wider rounded transition-all">
            Return Home
          </a>
        </div>

      </div>
    </div>
  `
})
export class RestaurantDashboardComponent implements OnInit {
  restaurant: Restaurant | null = null;
  orders: Order[] = [];
  items: MenuItem[] = [];
  categories: MenuCategory[] = [];
  loading: boolean = true;

  constructor(
    private restaurantService: RestaurantService,
    private orderService: OrderService,
    private menuService: MenuService
  ) {}

  ngOnInit(): void {
    this.loadRestaurantData();
  }

  loadRestaurantData(): void {
    this.loading = true;
    this.restaurantService.getMyRestaurant().subscribe({
      next: res => {
        this.loading = false;
        if (res.success && res.data) {
          this.restaurant = res.data;
          this.loadOrders();
          this.loadMenu(res.data.id);
        }
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  loadOrders(): void {
    this.orderService.getRestaurantOrders().subscribe({
      next: res => {
        if (res.success && res.data) {
          this.orders = res.data;
        }
      }
    });
  }

  loadMenu(restaurantId: number): void {
    this.menuService.getCategories(restaurantId).subscribe({
      next: res => {
        if (res.success && res.data) {
          this.categories = res.data;
        }
      }
    });

    this.menuService.getItems(restaurantId, false).subscribe({
      next: res => {
        if (res.success && res.data) {
          this.items = res.data;
        }
      }
    });
  }

  get recentOrders(): Order[] {
    return [...this.orders].slice(0, 5);
  }

  get placedOrders(): Order[] {
    return this.orders.filter(o => o.status === 'PLACED');
  }

  get activeOrdersCount(): number {
    return this.orders.filter(o => 
      o.status === 'PLACED' || o.status === 'ACCEPTED' || o.status === 'PREPARING'
    ).length;
  }

  get revenue(): number {
    return this.orders
      .filter(o => o.status === 'DELIVERED')
      .reduce((sum, o) => sum + Number(o.totalAmount), 0);
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
}
