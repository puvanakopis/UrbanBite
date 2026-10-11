import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { Order, OrderStatus } from '../../../models/order.models';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="bg-[#090909] min-h-[90vh] py-12 sm:py-16 text-neutral-200">
      <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <!-- Executive Page Header -->
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-4 border-b border-[#242424]">
          <div>
            <span class="text-xs font-bold uppercase tracking-[2.5px] text-gold mb-2 block">
              TRANSACTION & DISPATCH OVERSIGHT
            </span>
            <div class="flex items-center gap-3">
              <h1 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Order Management
              </h1>
              <span class="px-2.5 py-1 text-[10px] font-bold tracking-wider rounded uppercase bg-emerald-950/60 border border-emerald-500/40 text-emerald-400">
                <span class="inline-block w-1.5 h-1.5 rounded-full mr-1 bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]"></span>
                {{ deliveredOrdersCount }} Delivered
              </span>
            </div>
          </div>

          <!-- Header Actions -->
          <div class="flex items-center gap-3">
            <button 
              (click)="loadOrders()" 
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
              <span class="text-[11px] font-bold tracking-wider text-neutral-400 uppercase">TOTAL TRANSACTIONS</span>
              <i class="fa-solid fa-receipt text-xs text-gold"></i>
            </div>
            <span class="text-3xl font-extrabold text-white font-serif mb-1">{{ orders.length }}</span>
            <span class="text-xs text-neutral-500">Gross: &#36;{{ grossPlatformRevenue | number:'1.2-2' }}</span>
          </div>

          <div class="bg-[#141414] border border-[#242424] rounded p-6 shadow-xl flex flex-col justify-between hover:border-gold/40 transition-colors">
            <div class="flex justify-between items-start mb-3">
              <span class="text-[11px] font-bold tracking-wider uppercase text-gold">IN PROGRESS</span>
              <i class="fa-solid fa-route text-xs text-gold"></i>
            </div>
            <span class="text-3xl font-extrabold text-gold font-serif mb-1">{{ inProgressCount }}</span>
            <span class="text-xs text-neutral-500">In kitchen prep or on route</span>
          </div>

          <div class="bg-[#141414] border border-[#242424] rounded p-6 shadow-xl flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
            <div class="flex justify-between items-start mb-3">
              <span class="text-[11px] font-bold tracking-wider uppercase text-emerald-400">FULFILLED ORDERS</span>
              <i class="fa-solid fa-circle-check text-xs text-emerald-400"></i>
            </div>
            <span class="text-3xl font-extrabold text-emerald-400 font-serif mb-1">{{ deliveredOrdersCount }}</span>
            <span class="text-xs text-neutral-500">Successfully delivered to doors</span>
          </div>

          <div class="bg-[#141414] border border-[#242424] rounded p-6 shadow-xl flex flex-col justify-between hover:border-rose-500/40 transition-colors">
            <div class="flex justify-between items-start mb-3">
              <span class="text-[11px] font-bold tracking-wider uppercase text-rose-400">CANCELLED / REJECTED</span>
              <i class="fa-solid fa-ban text-xs text-rose-400"></i>
            </div>
            <span class="text-3xl font-extrabold text-rose-400 font-serif mb-1">{{ cancelledOrdersCount }}</span>
            <span class="text-xs text-neutral-500">Failed or aborted dispatches</span>
          </div>
        </div>

        <!-- Filter & Search Toolbar (Customer & Restaurant Orders Style) -->
        <div class="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-6">
          
          <!-- Dropdowns Group: Status Filter + Payment Filter -->
          <div class="flex flex-wrap items-center gap-3">
            
            <!-- Status Dropdown Selector -->
            <div class="relative min-w-[200px] sm:w-60">
              <div class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold text-xs pointer-events-none">
                <i class="fa-solid fa-filter"></i>
              </div>
              <select 
                [(ngModel)]="selectedStatusFilter" 
                class="w-full pl-9 pr-9 py-2 bg-[#141414] border border-[#242424] rounded text-xs text-white focus:outline-none focus:border-gold transition-colors appearance-none cursor-pointer font-bold tracking-wider uppercase">
                <option value="ALL" class="bg-[#141414] text-white">All Order Stages ({{ orders.length }})</option>
                <option value="PLACED" class="bg-[#141414] text-white">Placed / New</option>
                <option value="ACCEPTED" class="bg-[#141414] text-white">Accepted</option>
                <option value="PREPARING" class="bg-[#141414] text-white">Kitchen Preparing</option>
                <option value="READY_FOR_PICKUP" class="bg-[#141414] text-white">Ready for Pickup</option>
                <option value="OUT_FOR_DELIVERY" class="bg-[#141414] text-white">Out for Delivery</option>
                <option value="DELIVERED" class="bg-[#141414] text-white">Delivered ({{ deliveredOrdersCount }})</option>
                <option value="CANCELLED" class="bg-[#141414] text-white">Cancelled</option>
                <option value="REJECTED" class="bg-[#141414] text-white">Rejected</option>
              </select>
              <div class="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-[10px] pointer-events-none">
                <i class="fa-solid fa-chevron-down"></i>
              </div>
            </div>

            <!-- Payment Method Dropdown Selector -->
            <div class="relative min-w-[180px] sm:w-56">
              <div class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold text-xs pointer-events-none">
                <i class="fa-solid fa-credit-card"></i>
              </div>
              <select 
                [(ngModel)]="selectedPaymentFilter" 
                class="w-full pl-9 pr-9 py-2 bg-[#141414] border border-[#242424] rounded text-xs text-white focus:outline-none focus:border-gold transition-colors appearance-none cursor-pointer font-bold tracking-wider uppercase">
                <option value="ALL" class="bg-[#141414] text-white">All Payment Methods</option>
                <option *ngFor="let p of uniquePaymentMethods" [value]="p" class="bg-[#141414] text-white">{{ p }}</option>
              </select>
              <div class="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-[10px] pointer-events-none">
                <i class="fa-solid fa-chevron-down"></i>
              </div>
            </div>

            <!-- Showing Count Badge -->
            <span class="hidden md:inline-flex items-center px-2.5 py-1.5 text-[11px] font-bold text-neutral-400 bg-[#141414] border border-[#242424] rounded">
              Showing {{ filteredOrders.length }} of {{ orders.length }}
            </span>
          </div>

          <!-- Search Bar -->
          <div class="relative min-w-[260px] md:w-80">
            <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 text-xs"></i>
            <input 
              type="text" 
              [(ngModel)]="searchQuery" 
              placeholder="Search by #order, customer, restaurant..." 
              class="w-full pl-9 pr-8 py-2 bg-[#141414] border border-[#242424] rounded text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-gold transition-colors" />
            <button *ngIf="searchQuery" 
                    (click)="searchQuery = ''" 
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white text-xs">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="bg-[#141414] border border-[#242424] rounded p-20 text-center mb-8">
          <div class="w-10 h-10 border-2 border-neutral-700 border-t-gold rounded-full animate-spin mx-auto mb-4"></div>
          <h3 class="text-base font-bold text-white mb-1">Retrieving Platform Orders</h3>
          <p class="text-xs text-neutral-400">Syncing with transaction ledger and dispatch network...</p>
        </div>

        <!-- Empty State -->
        <div *ngIf="!loading && filteredOrders.length === 0" 
             class="bg-[#141414] border border-[#242424] rounded p-16 text-center text-neutral-500 text-xs shadow-xl mb-8">
          <div class="w-16 h-16 rounded bg-[#1b1b1b] border border-[#282828] mx-auto flex items-center justify-center text-gold/80 text-2xl mb-4">
            <i class="fa-solid fa-receipt"></i>
          </div>
          <p class="font-bold text-white text-base">No orders matched criteria</p>
          <p class="text-xs text-neutral-400 mt-1 mb-4">
            {{ searchQuery ? 'No transaction tickets match your search query.' : 'No orders found matching the selected filter options.' }}
          </p>
          <button (click)="resetFilters()" 
                  class="px-5 py-2.5 bg-gold hover:bg-gold-light text-black font-extrabold text-xs uppercase tracking-wider rounded transition-all cursor-pointer shadow-md inline-flex items-center gap-2">
            <i class="fa-solid fa-arrows-rotate"></i> Reset Filters
          </button>
        </div>

        <!-- Orders Oversight Table -->
        <div *ngIf="!loading && filteredOrders.length > 0" 
             class="bg-[#141414] border border-[#242424] rounded shadow-xl overflow-hidden mb-12">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs border-collapse">
              <thead>
                <tr class="border-b border-[#242424] text-neutral-400 font-bold uppercase tracking-wider bg-[#0f0f0f]">
                  <th class="p-4 sm:p-5">Order #</th>
                  <th class="p-4 sm:p-5">Customer Patron</th>
                  <th class="p-4 sm:p-5">Kitchen Venue</th>
                  <th class="p-4 sm:p-5">Gross Amount</th>
                  <th class="p-4 sm:p-5">Payment Details</th>
                  <th class="p-4 sm:p-5 text-center">Lifecycle Status</th>
                  <th class="p-4 sm:p-5 text-right">Receipt Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#1e1e1e]">
                <tr *ngFor="let ord of filteredOrders" class="hover:bg-[#181818] transition-colors">
                  <!-- Order Number & Date -->
                  <td class="p-4 sm:p-5">
                    <span class="font-mono font-bold text-white block text-sm">#{{ ord.orderNumber }}</span>
                    <span class="text-neutral-500 text-[10px]">{{ ord.createdAt | date:'MMM d, y, h:mm a' }}</span>
                  </td>

                  <!-- Customer -->
                  <td class="p-4 sm:p-5">
                    <strong class="text-white block">{{ ord.customer?.fullName || 'Customer' }}</strong>
                    <span class="text-neutral-500 text-[11px] block truncate max-w-xs">{{ ord.deliveryAddressText }}</span>
                  </td>

                  <!-- Restaurant -->
                  <td class="p-4 sm:p-5">
                    <strong class="text-white block">{{ ord.restaurant?.name || 'Restaurant' }}</strong>
                    <span class="text-gold text-[11px]">{{ ord.restaurant?.cuisine }} &bull; {{ ord.restaurant?.city }}</span>
                  </td>

                  <!-- Amount -->
                  <td class="p-4 sm:p-5">
                    <span class="text-sm font-extrabold font-serif text-white block">
                      &#36;{{ ord.totalAmount | number:'1.2-2' }}
                    </span>
                    <span class="text-[10px] text-neutral-500">{{ ord.items.length || 0 }} items</span>
                  </td>

                  <!-- Payment -->
                  <td class="p-4 sm:p-5">
                    <span class="text-neutral-300 font-bold block">{{ ord.paymentMethod }}</span>
                    <span class="text-[10px]" [ngClass]="ord.paymentStatus === 'PAID' ? 'text-emerald-400' : 'text-neutral-400'">
                      {{ ord.paymentStatus }}
                    </span>
                  </td>

                  <!-- Status -->
                  <td class="p-4 sm:p-5 text-center">
                    <span class="px-2.5 py-1 text-[10px] font-extrabold tracking-wider rounded uppercase border"
                          [ngClass]="{
                            'bg-emerald-950/60 border-emerald-500/40 text-emerald-400': ord.status === 'DELIVERED',
                            'bg-rose-950/60 border-rose-500/40 text-rose-400': ord.status === 'CANCELLED' || ord.status === 'REJECTED',
                            'bg-amber-950/60 border-amber-500/40 text-amber-400': ord.status === 'ACCEPTED' || ord.status === 'PREPARING',
                            'bg-blue-950/60 border-blue-500/40 text-blue-400': ord.status === 'READY_FOR_PICKUP' || ord.status === 'OUT_FOR_DELIVERY',
                            'bg-gold/15 border-gold/40 text-gold': ord.status === 'PLACED'
                          }">
                      {{ ord.status.replace('_', ' ') }}
                    </span>
                  </td>

                  <!-- Action -->
                  <td class="p-4 sm:p-5 text-right">
                    <button (click)="openReceiptModal(ord)" 
                            class="px-3 py-1.5 text-[11px] font-bold rounded border border-neutral-700 hover:border-white text-neutral-300 hover:text-white transition-all cursor-pointer">
                      <i class="fa-solid fa-file-invoice mr-1 text-gold"></i> View Receipt
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Receipt Inspection Modal -->
        <div *ngIf="inspectingOrder" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div class="bg-[#141414] border border-[#242424] rounded-lg max-w-2xl w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div class="flex justify-between items-start pb-4 border-b border-[#242424] mb-6">
              <div>
                <span class="text-xs font-bold uppercase tracking-[2px] text-gold block">AUDIT RECEIPT RECORD</span>
                <h3 class="text-xl font-extrabold text-white font-mono">Order #{{ inspectingOrder.orderNumber }}</h3>
                <p class="text-xs text-neutral-400">Placed on {{ inspectingOrder.createdAt | date:'medium' }}</p>
              </div>
              <button (click)="inspectingOrder = null" class="text-neutral-500 hover:text-white text-base cursor-pointer">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>

            <!-- Route & Entities Summary -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div class="p-4 rounded bg-[#0d0d0d] border border-[#202020] text-xs">
                <span class="text-neutral-500 uppercase font-bold text-[10px] block mb-1">Customer Patron</span>
                <strong class="text-white block text-sm">{{ inspectingOrder.customer?.fullName || 'Customer' }}</strong>
                <p class="text-neutral-400 mt-1">{{ inspectingOrder.deliveryAddressText }}</p>
                <p *ngIf="inspectingOrder.customer?.phone" class="text-neutral-500 font-mono mt-0.5">{{ inspectingOrder.customer?.phone }}</p>
              </div>

              <div class="p-4 rounded bg-[#0d0d0d] border border-[#202020] text-xs">
                <span class="text-neutral-500 uppercase font-bold text-[10px] block mb-1">Kitchen Partner</span>
                <strong class="text-white block text-sm">{{ inspectingOrder.restaurant?.name || 'Restaurant' }}</strong>
                <p class="text-neutral-400 mt-1">{{ inspectingOrder.restaurant?.address }}, {{ inspectingOrder.restaurant?.city }}</p>
                <p class="text-gold mt-0.5">{{ inspectingOrder.restaurant?.cuisine }}</p>
              </div>
            </div>

            <!-- Special Note if present -->
            <div *ngIf="inspectingOrder.customerNotes" class="mb-6 p-3 bg-gold/10 border border-gold/30 rounded text-gold text-xs">
              <i class="fa-solid fa-note-sticky mr-1.5"></i> Customer Special Request: {{ inspectingOrder.customerNotes }}
            </div>

            <!-- Ordered Line Items -->
            <div class="mb-6">
              <span class="text-[10px] font-bold uppercase tracking-[2px] text-neutral-400 block mb-3">ORDERED DISHES & ITEMS</span>
              <div class="border border-[#202020] rounded divide-y divide-[#202020] text-xs">
                <div *ngFor="let item of inspectingOrder.items" class="p-3 bg-[#0d0d0d] flex items-center justify-between">
                  <div class="flex items-center gap-2.5">
                    <span class="w-6 h-6 rounded bg-[#1e1910] text-gold font-bold text-[11px] flex items-center justify-center">
                      {{ item.quantity }}x
                    </span>
                    <div>
                      <strong class="text-white">{{ item.itemName }}</strong>
                      <span *ngIf="item.variantName" class="text-neutral-500 block text-[10px]">{{ item.variantName }}</span>
                    </div>
                  </div>
                  <span class="font-mono font-bold text-white">&#36;{{ item.itemTotal | number:'1.2-2' }}</span>
                </div>
              </div>
            </div>

            <!-- Financial Calculation Ledger -->
            <div class="p-4 rounded bg-[#0d0d0d] border border-[#202020] space-y-2 text-xs mb-6">
              <div class="flex justify-between text-neutral-400">
                <span>Subtotal Items</span>
                <span>&#36;{{ inspectingOrder.subtotal | number:'1.2-2' }}</span>
              </div>
              <div class="flex justify-between text-neutral-400">
                <span>Delivery Logistics Fee</span>
                <span>&#36;{{ inspectingOrder.deliveryFee | number:'1.2-2' }}</span>
              </div>
              <div class="flex justify-between text-neutral-400">
                <span>Calculated Tax</span>
                <span>&#36;{{ inspectingOrder.taxAmount | number:'1.2-2' }}</span>
              </div>
              <div *ngIf="inspectingOrder.discountAmount > 0" class="flex justify-between text-emerald-400 font-bold">
                <span>Promotional Discount ({{ inspectingOrder.couponCode || 'PROMO' }})</span>
                <span>-&#36;{{ inspectingOrder.discountAmount | number:'1.2-2' }}</span>
              </div>
              <div class="pt-2 border-t border-[#242424] flex justify-between text-sm font-extrabold text-white">
                <span>Grand Total Settled</span>
                <span class="text-gold font-serif text-base">&#36;{{ inspectingOrder.totalAmount | number:'1.2-2' }}</span>
              </div>
            </div>

            <div class="pt-4 border-t border-[#242424] flex justify-end">
              <button (click)="inspectingOrder = null" 
                      class="px-5 py-2.5 bg-gold hover:bg-gold-light text-black font-extrabold text-xs uppercase tracking-wider rounded transition-all cursor-pointer">
                Close Inspection
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  `
})
export class AdminOrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = false;
  inspectingOrder: Order | null = null;

  selectedStatusFilter = 'ALL';
  selectedPaymentFilter = 'ALL';
  searchQuery = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.adminService.getAllOrders().subscribe({
      next: res => {
        this.loading = false;
        if (res.success && res.data) {
          this.orders = res.data;
        }
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  get deliveredOrdersCount(): number {
    return this.orders.filter(o => o.status === 'DELIVERED').length;
  }

  get inProgressCount(): number {
    return this.orders.filter(o => o.status !== 'DELIVERED' && o.status !== 'CANCELLED' && o.status !== 'REJECTED').length;
  }

  get cancelledOrdersCount(): number {
    return this.orders.filter(o => o.status === 'CANCELLED' || o.status === 'REJECTED').length;
  }

  get grossPlatformRevenue(): number {
    return this.orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  }

  get uniquePaymentMethods(): string[] {
    const set = new Set<string>();
    this.orders.forEach(o => {
      if (o.paymentMethod) set.add(o.paymentMethod);
    });
    return Array.from(set);
  }

  get filteredOrders(): Order[] {
    return this.orders.filter(o => {
      // Status filter
      if (this.selectedStatusFilter !== 'ALL' && o.status !== this.selectedStatusFilter) {
        return false;
      }
      // Payment filter
      if (this.selectedPaymentFilter !== 'ALL' && o.paymentMethod !== this.selectedPaymentFilter) {
        return false;
      }
      // Search query
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        const matchesNumber = o.orderNumber?.toLowerCase().includes(q);
        const matchesCustomer = o.customer?.fullName?.toLowerCase().includes(q);
        const matchesRestaurant = o.restaurant?.name?.toLowerCase().includes(q);
        const matchesAddress = o.deliveryAddressText?.toLowerCase().includes(q);
        if (!matchesNumber && !matchesCustomer && !matchesRestaurant && !matchesAddress) {
          return false;
        }
      }
      return true;
    });
  }

  resetFilters(): void {
    this.selectedStatusFilter = 'ALL';
    this.selectedPaymentFilter = 'ALL';
    this.searchQuery = '';
    this.loadOrders();
  }

  openReceiptModal(order: Order): void {
    this.inspectingOrder = order;
  }
}
