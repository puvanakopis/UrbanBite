import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { Restaurant } from '../../../models/restaurant.models';
import { Order } from '../../../models/order.models';
import { User } from '../../../models/auth.models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-[#090909] min-h-[90vh] py-12 sm:py-16 text-neutral-200">
      <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <!-- Executive Page Header (Clean Style Matching Restaurant & Delivery) -->
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-4 border-b border-[#242424]">
          <div>
            <span class="text-xs font-bold uppercase tracking-[2.5px] text-gold mb-2 block">
              EXECUTIVE PLATFORM GOVERNANCE
            </span>
            <div class="flex items-center gap-3">
              <h1 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Platform Dashboard
              </h1>
              <span class="px-2.5 py-1 text-[10px] font-bold tracking-wider rounded uppercase bg-emerald-950/60 border border-emerald-500/40 text-emerald-400">
                <span class="inline-block w-1.5 h-1.5 rounded-full mr-1 bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]"></span>
                System Operational
              </span>
            </div>
          </div>

          <!-- Header Actions -->
          <div class="flex items-center gap-3">
            <button 
              (click)="loadAllData()" 
              class="px-4 py-2 border border-neutral-700 hover:border-white text-neutral-300 hover:text-white rounded text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2">
              <i class="fa-solid fa-arrows-rotate" [ngClass]="{'fa-spin': loading}"></i>
              <span>Refresh Metrics</span>
            </button>

            <a 
              routerLink="/admin-portal/orders" 
              class="px-5 py-2.5 bg-gold hover:bg-gold-light text-black font-extrabold text-xs uppercase tracking-wider rounded transition-all cursor-pointer shadow-md flex items-center gap-2">
              <i class="fa-solid fa-receipt"></i>
              <span>Live Orders</span>
            </a>
          </div>
        </div>

        <!-- KPI Metrics Grid (Matching Restaurant Dashboard Grid) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          
          <!-- Card 1: Platform Users -->
          <div class="bg-[#141414] border border-[#242424] hover:border-neutral-700 rounded p-6 shadow-xl flex flex-col justify-between transition-colors">
            <div class="flex justify-between items-start mb-3">
              <span class="text-[11px] font-bold tracking-wider text-neutral-400 uppercase">
                TOTAL REGISTERED USERS
              </span>
              <i class="fa-solid fa-users text-xs text-gold"></i>
            </div>
            <span class="text-3xl font-extrabold text-white font-serif mb-1">
              {{ stats?.totalUsers || users.length || 0 }}
            </span>
            <span class="text-xs text-neutral-500">
              {{ stats?.totalCustomers || getCountByRole('ROLE_CUSTOMER') }} customers • {{ stats?.totalDeliveryPartners || getCountByRole('ROLE_DELIVERY_PARTNER') }} couriers
            </span>
          </div>

          <!-- Card 2: Active Lofts -->
          <div class="bg-[#141414] border border-[#242424] hover:border-neutral-700 rounded p-6 shadow-xl flex flex-col justify-between transition-colors">
            <div class="flex justify-between items-start mb-3">
              <span class="text-[11px] font-bold tracking-wider text-neutral-400 uppercase">
                CURATED RESTAURANTS
              </span>
              <i class="fa-solid fa-store text-xs text-gold"></i>
            </div>
            <span class="text-3xl font-extrabold text-gold font-serif mb-1">
              {{ approvedRestaurantsCount }} / {{ restaurants.length }}
            </span>
            <span class="text-xs text-neutral-500">
              {{ activeKitchensCount }} currently accepting kitchen orders
            </span>
          </div>

          <!-- Card 3: Orders Processed -->
          <div class="bg-[#141414] border border-[#242424] hover:border-neutral-700 rounded p-6 shadow-xl flex flex-col justify-between transition-colors">
            <div class="flex justify-between items-start mb-3">
              <span class="text-[11px] font-bold tracking-wider text-neutral-400 uppercase">
                ORDERS FULFILLED
              </span>
              <i class="fa-solid fa-receipt text-xs text-gold"></i>
            </div>
            <span class="text-3xl font-extrabold text-white font-serif mb-1">
              {{ orders.length }}
            </span>
            <span class="text-xs text-neutral-500">
              {{ deliveredOrdersCount }} completed • {{ activeOrdersCount }} in progress
            </span>
          </div>

          <!-- Card 4: Gross Platform Revenue -->
          <div class="bg-[#141414] border border-[#242424] hover:border-emerald-500/40 rounded p-6 shadow-xl flex flex-col justify-between transition-colors">
            <div class="flex justify-between items-start mb-3">
              <span class="text-[11px] font-bold tracking-wider text-neutral-400 uppercase">
                GROSS REVENUE VOLUME
              </span>
              <i class="fa-solid fa-dollar-sign text-xs text-emerald-400"></i>
            </div>
            <span class="text-3xl font-extrabold text-emerald-400 font-serif mb-1">
              &#36;{{ grossPlatformRevenue | number:'1.2-2' }}
            </span>
            <span class="text-xs text-neutral-500">
              Avg ticket: &#36;{{ averageTicketAmount | number:'1.2-2' }}
            </span>
          </div>
        </div>

        <!-- Platform Administration Portals Shortcuts Grid -->
        <div class="mb-12">
          <div class="flex items-center justify-between pb-3 mb-6 border-b border-[#242424]">
            <span class="text-xs font-bold uppercase tracking-[2px] text-gold block">
              PLATFORM MANAGEMENT MODULES
            </span>
            <span class="text-xs text-neutral-500">Executive control suites</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <!-- Module 1: Restaurant Management -->
            <a routerLink="/admin-portal/restaurants" 
               class="bg-[#141414] border border-[#242424] hover:border-gold/60 rounded p-6 flex flex-col justify-between gap-4 transition-all shadow-xl group">
              <div>
                <div class="w-10 h-10 rounded bg-[#1e1910] border border-gold/30 flex items-center justify-center text-gold text-base mb-4 group-hover:scale-105 transition-transform">
                  <i class="fa-solid fa-store"></i>
                </div>
                <h3 class="text-base font-bold text-white group-hover:text-gold transition-colors">Restaurant Management</h3>
                <p class="text-xs text-neutral-400 mt-1 leading-relaxed">
                  Moderate partner venues, approve kitchen enrollments, and toggle operational status.
                </p>
              </div>
              <div class="flex items-center justify-between pt-3 border-t border-[#202020] text-xs">
                <span class="text-neutral-500 font-bold uppercase text-[10px]">{{ restaurants.length }} Partners</span>
                <span class="text-gold font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Manage <i class="fa-solid fa-chevron-right text-[10px]"></i>
                </span>
              </div>
            </a>

            <!-- Module 2: Customer Management -->
            <a routerLink="/admin-portal/customers" 
               class="bg-[#141414] border border-[#242424] hover:border-gold/60 rounded p-6 flex flex-col justify-between gap-4 transition-all shadow-xl group">
              <div>
                <div class="w-10 h-10 rounded bg-[#1e1910] border border-gold/30 flex items-center justify-center text-gold text-base mb-4 group-hover:scale-105 transition-transform">
                  <i class="fa-solid fa-users"></i>
                </div>
                <h3 class="text-base font-bold text-white group-hover:text-gold transition-colors">Customer Management</h3>
                <p class="text-xs text-neutral-400 mt-1 leading-relaxed">
                  Manage user credentials, review account verifications, and enforce suspension protocols.
                </p>
              </div>
              <div class="flex items-center justify-between pt-3 border-t border-[#202020] text-xs">
                <span class="text-neutral-500 font-bold uppercase text-[10px]">{{ users.length }} Users</span>
                <span class="text-gold font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Manage <i class="fa-solid fa-chevron-right text-[10px]"></i>
                </span>
              </div>
            </a>

            <!-- Module 3: Order Management -->
            <a routerLink="/admin-portal/orders" 
               class="bg-[#141414] border border-[#242424] hover:border-gold/60 rounded p-6 flex flex-col justify-between gap-4 transition-all shadow-xl group">
              <div>
                <div class="w-10 h-10 rounded bg-[#1e1910] border border-gold/30 flex items-center justify-center text-gold text-base mb-4 group-hover:scale-105 transition-transform">
                  <i class="fa-solid fa-receipt"></i>
                </div>
                <h3 class="text-base font-bold text-white group-hover:text-gold transition-colors">Order Management</h3>
                <p class="text-xs text-neutral-400 mt-1 leading-relaxed">
                  Platform-wide transaction surveillance, live dispatch stages, and customer receipts.
                </p>
              </div>
              <div class="flex items-center justify-between pt-3 border-t border-[#202020] text-xs">
                <span class="text-neutral-500 font-bold uppercase text-[10px]">{{ orders.length }} Tickets</span>
                <span class="text-gold font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Surveil <i class="fa-solid fa-chevron-right text-[10px]"></i>
                </span>
              </div>
            </a>

            <!-- Module 4: Admin Profile -->
            <a routerLink="/admin-portal/profile" 
               class="bg-[#141414] border border-[#242424] hover:border-gold/60 rounded p-6 flex flex-col justify-between gap-4 transition-all shadow-xl group">
              <div>
                <div class="w-10 h-10 rounded bg-[#1e1910] border border-gold/30 flex items-center justify-center text-gold text-base mb-4 group-hover:scale-105 transition-transform">
                  <i class="fa-solid fa-user-shield"></i>
                </div>
                <h3 class="text-base font-bold text-white group-hover:text-gold transition-colors">Admin Profile</h3>
                <p class="text-xs text-neutral-400 mt-1 leading-relaxed">
                  Executive authorization security, audit logs, and account access credentials.
                </p>
              </div>
              <div class="flex items-center justify-between pt-3 border-t border-[#202020] text-xs">
                <span class="text-neutral-500 font-bold uppercase text-[10px]">Executive Root</span>
                <span class="text-gold font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Configure <i class="fa-solid fa-chevron-right text-[10px]"></i>
                </span>
              </div>
            </a>

          </div>
        </div>

        <!-- 2 Column Overview Section: Recent High-Priority Orders & Restaurant Moderation -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <!-- Column 1: Live Transactions Preview -->
          <div class="bg-[#141414] border border-[#242424] rounded p-6 shadow-xl">
            <div class="flex items-center justify-between pb-4 border-b border-[#242424] mb-4">
              <div>
                <span class="text-xs font-bold uppercase tracking-[2px] text-gold block">TRANSACTION MONITOR</span>
                <h3 class="text-base font-bold text-white">Recent Platform Orders</h3>
              </div>
              <a routerLink="/admin-portal/orders" class="text-xs font-bold text-gold hover:underline flex items-center gap-1">
                View All <i class="fa-solid fa-arrow-right text-[10px]"></i>
              </a>
            </div>

            <div *ngIf="orders.length === 0" class="py-12 text-center text-neutral-500 text-xs">
              <i class="fa-solid fa-receipt text-2xl text-neutral-600 mb-2 block"></i>
              No orders registered on the platform yet.
            </div>

            <div *ngIf="orders.length > 0" class="divide-y divide-[#1e1e1e]">
              <div *ngFor="let ord of recentOrders" class="py-3.5 flex items-center justify-between gap-4">
                <div class="min-w-0">
                  <div class="flex items-center gap-2">
                    <span class="font-mono font-bold text-white text-xs">#{{ ord.orderNumber }}</span>
                    <span class="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded border"
                          [ngClass]="{
                            'bg-emerald-950/60 border-emerald-500/30 text-emerald-400': ord.status === 'DELIVERED',
                            'bg-rose-950/60 border-rose-500/30 text-rose-400': ord.status === 'CANCELLED' || ord.status === 'REJECTED',
                            'bg-gold/15 border-gold/40 text-gold': ord.status !== 'DELIVERED' && ord.status !== 'CANCELLED' && ord.status !== 'REJECTED'
                          }">
                      {{ ord.status.replace('_', ' ') }}
                    </span>
                  </div>
                  <p class="text-[11px] text-neutral-400 truncate mt-0.5">
                    {{ ord.customer?.fullName || 'Customer' }} &bull; {{ ord.restaurant?.name || 'Restaurant' }}
                  </p>
                </div>

                <div class="text-right shrink-0">
                  <span class="text-xs font-extrabold text-white font-serif block">
                    &#36;{{ ord.totalAmount | number:'1.2-2' }}
                  </span>
                  <span class="text-[10px] text-neutral-500">
                    {{ ord.createdAt | date:'shortTime' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Column 2: Partner Restaurant Lofts Overview -->
          <div class="bg-[#141414] border border-[#242424] rounded p-6 shadow-xl">
            <div class="flex items-center justify-between pb-4 border-b border-[#242424] mb-4">
              <div>
                <span class="text-xs font-bold uppercase tracking-[2px] text-gold block">PARTNER ROSTER</span>
                <h3 class="text-base font-bold text-white">Restaurant Lofts Status</h3>
              </div>
              <a routerLink="/admin-portal/restaurants" class="text-xs font-bold text-gold hover:underline flex items-center gap-1">
                View All <i class="fa-solid fa-arrow-right text-[10px]"></i>
              </a>
            </div>

            <div *ngIf="restaurants.length === 0" class="py-12 text-center text-neutral-500 text-xs">
              <i class="fa-solid fa-store text-2xl text-neutral-600 mb-2 block"></i>
              No restaurants registered on the platform yet.
            </div>

            <div *ngIf="restaurants.length > 0" class="divide-y divide-[#1e1e1e]">
              <div *ngFor="let rest of recentRestaurants" class="py-3.5 flex items-center justify-between gap-4">
                <div class="min-w-0">
                  <div class="flex items-center gap-2">
                    <strong class="text-xs font-bold text-white truncate">{{ rest.name }}</strong>
                    <span class="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded border"
                          [ngClass]="{
                            'bg-emerald-950/60 border-emerald-500/30 text-emerald-400': rest.status === 'APPROVED',
                            'bg-rose-950/60 border-rose-500/30 text-rose-400': rest.status === 'SUSPENDED',
                            'bg-gold/15 border-gold/40 text-gold': rest.status === 'PENDING'
                          }">
                      {{ rest.status }}
                    </span>
                  </div>
                  <p class="text-[11px] text-neutral-400 truncate mt-0.5">
                    {{ rest.cuisine }} &bull; {{ rest.city }} &bull; ★ {{ rest.rating }}
                  </p>
                </div>

                <div class="text-right shrink-0">
                  <span class="px-2 py-0.5 text-[10px] font-bold rounded uppercase"
                        [ngClass]="rest.isOpen ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30' : 'bg-neutral-900 text-neutral-500 border border-neutral-700'">
                    {{ rest.isOpen ? 'Kitchen Open' : 'Closed' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  stats: any = null;
  loading: boolean = false;

  restaurants: Restaurant[] = [];
  orders: Order[] = [];
  users: User[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData(): void {
    this.loading = true;

    // Load Stats
    this.adminService.getPlatformStats().subscribe({
      next: res => {
        if (res.success && res.data) {
          this.stats = res.data;
        }
      }
    });

    // Load Restaurants
    this.adminService.getAllRestaurants().subscribe({
      next: res => {
        if (res.success && res.data) {
          this.restaurants = res.data;
        }
      }
    });

    // Load Orders
    this.adminService.getAllOrders().subscribe({
      next: res => {
        if (res.success && res.data) {
          this.orders = res.data;
        }
      }
    });

    // Load Users
    this.adminService.getUsers().subscribe({
      next: res => {
        this.loading = false;
        if (res.success && res.data) {
          this.users = res.data;
        }
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getCountByRole(role: string): number {
    return this.users.filter(u => u.role === role).length;
  }

  get approvedRestaurantsCount(): number {
    return this.restaurants.filter(r => r.status === 'APPROVED').length;
  }

  get activeKitchensCount(): number {
    return this.restaurants.filter(r => r.isOpen).length;
  }

  get deliveredOrdersCount(): number {
    return this.orders.filter(o => o.status === 'DELIVERED').length;
  }

  get activeOrdersCount(): number {
    return this.orders.filter(o => o.status !== 'DELIVERED' && o.status !== 'CANCELLED' && o.status !== 'REJECTED').length;
  }

  get grossPlatformRevenue(): number {
    if (this.stats?.totalRevenue) return this.stats.totalRevenue;
    return this.orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  }

  get averageTicketAmount(): number {
    if (this.orders.length === 0) return 0;
    return this.grossPlatformRevenue / this.orders.length;
  }

  get recentOrders(): Order[] {
    return [...this.orders].slice(0, 5);
  }

  get recentRestaurants(): Restaurant[] {
    return [...this.restaurants].slice(0, 5);
  }
}
