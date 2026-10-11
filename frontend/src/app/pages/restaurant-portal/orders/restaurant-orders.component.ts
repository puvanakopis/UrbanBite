import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RestaurantService } from '../../../services/restaurant.service';
import { OrderService } from '../../../services/order.service';
import { Restaurant } from '../../../models/restaurant.models';
import { Order, OrderStatus } from '../../../models/order.models';

@Component({
  selector: 'app-restaurant-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="bg-[#090909] min-h-[90vh] py-12 sm:py-16 text-neutral-200">
      <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <!-- Customer-Style Page Header -->
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-4 border-b border-[#242424]">
          <div>
            <span class="text-xs font-bold uppercase tracking-[2.5px] text-gold mb-2 block">
              KITCHEN OPERATIONS & TICKETS
            </span>
            <div class="flex items-center gap-3">
              <h1 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Order Management
              </h1>
              <span *ngIf="restaurant" class="px-2.5 py-1 text-[10px] font-bold tracking-wider rounded uppercase"
                    [ngClass]="restaurant.isOpen ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-400' : 'bg-rose-950/60 border border-rose-500/40 text-rose-400'">
                <span class="inline-block w-1.5 h-1.5 rounded-full mr-1" [ngClass]="restaurant.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'"></span>
                {{ restaurant.isOpen ? 'Kitchen Open' : 'Kitchen Closed' }}
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

            <button 
              *ngIf="restaurant"
              (click)="toggleKitchenStatus()" 
              class="px-4 py-2 border rounded font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2"
              [ngClass]="restaurant.isOpen ? 'border-[#333] text-neutral-300 hover:border-white hover:bg-white/5' : 'bg-gold hover:bg-gold-light text-black border-gold'">
              <span class="w-2 h-2 rounded-full" [ngClass]="restaurant.isOpen ? 'bg-emerald-400 shadow-[0_0_8px_#38b000]' : 'bg-rose-500'"></span>
              <span>{{ restaurant.isOpen ? 'Close Kitchen' : 'Open Kitchen' }}</span>
            </button>
          </div>
        </div>

        <!-- Filter & Search Toolbar (Customer Style) -->
        <div class="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-6">
          <!-- Status Dropdown Selector -->
          <div class="flex items-center gap-3">
            <div class="relative min-w-[220px] sm:w-64">
              <div class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold text-xs pointer-events-none">
                <i class="fa-solid fa-filter"></i>
              </div>
              <select 
                [(ngModel)]="selectedStatusFilter" 
                class="w-full pl-9 pr-9 py-2 bg-[#141414] border border-[#242424] rounded text-xs text-white focus:outline-none focus:border-gold transition-colors appearance-none cursor-pointer font-bold tracking-wider uppercase">
                <option *ngFor="let f of filterOptions" [value]="f.value" class="bg-[#141414] text-white">
                  {{ f.label }} ({{ getCountForFilter(f.value) }})
                </option>
              </select>
              <div class="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-[10px] pointer-events-none">
                <i class="fa-solid fa-chevron-down"></i>
              </div>
            </div>

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
              placeholder="Search by #order, customer, address..." 
              class="w-full pl-9 pr-8 py-2 bg-[#141414] border border-[#242424] rounded text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-gold transition-colors" />
            <button *ngIf="searchQuery" 
                    (click)="searchQuery = ''" 
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white text-xs">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="bg-[#141414] border border-[#242424] rounded p-20 text-center">
          <div class="w-10 h-10 border-2 border-neutral-700 border-t-gold rounded-full animate-spin mx-auto mb-4"></div>
          <h3 class="text-base font-bold text-white mb-1">Updating Kitchen Orders</h3>
          <p class="text-xs text-neutral-400">Syncing with live dispatch server...</p>
        </div>

        <!-- Empty State (Same as Menu Component) -->
        <div *ngIf="!loading && filteredOrders.length === 0" 
             class="bg-[#141414] border border-[#242424] rounded p-16 text-center text-neutral-500 text-xs shadow-xl">
          <div class="w-16 h-16 rounded bg-[#1b1b1b] border border-[#282828] mx-auto flex items-center justify-center text-gold/80 text-2xl mb-4">
            <i class="fa-solid fa-receipt"></i>
          </div>
          <p class="font-bold text-white text-base">No orders found</p>
          <p class="text-xs text-neutral-400 mt-1 mb-4">No kitchen orders matching your current filter criteria or search query.</p>
          <button (click)="resetFilters()" 
                  class="px-5 py-2.5 bg-gold hover:bg-gold-light text-black font-extrabold text-xs uppercase tracking-wider rounded transition-all cursor-pointer shadow-md inline-flex items-center gap-2">
            <i class="fa-solid fa-arrows-rotate"></i> Reset Filters
          </button>
        </div>

        <!-- Orders Grid (Customer Card Style) -->
        <div *ngIf="!loading && filteredOrders.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div *ngFor="let order of filteredOrders" 
               class="bg-[#141414] border rounded p-6 flex flex-col justify-between gap-4 transition-all shadow-xl"
               [ngClass]="order.status === 'PLACED' ? 'border-gold shadow-gold/5' : 'border-[#242424] hover:border-neutral-700'">
            <div>
              <!-- Header Strip -->
              <div class="flex justify-between items-center pb-3 border-b border-[#242424] mb-3">
                <div>
                  <span class="font-extrabold text-white text-sm mr-2 font-mono">#{{ order.orderNumber }}</span>
                  <span class="text-xs text-neutral-500">{{ order.createdAt | date:'shortTime' }}</span>
                </div>
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
              </div>

              <!-- Customer Info -->
              <div class="space-y-1 mb-3 text-xs">
                <div class="flex items-center justify-between">
                  <strong class="text-white block text-sm">{{ order.customer?.fullName }}</strong>
                  <span *ngIf="order.customer?.phone" class="text-neutral-400 text-[11px]">{{ order.customer?.phone }}</span>
                </div>
                <p class="text-neutral-400 flex items-start gap-1.5 mt-0.5">
                  <i class="fa-solid fa-location-dot text-gold text-[11px] mt-0.5 shrink-0"></i>
                  <span>{{ order.deliveryAddressText }}</span>
                </p>
                <div *ngIf="order.customerNotes" class="bg-gold/10 border border-gold/30 rounded p-2 text-gold text-[11px] mt-2">
                  <i class="fa-solid fa-note-sticky mr-1"></i> Special Note: {{ order.customerNotes }}
                </div>
              </div>

              <!-- Order Items List -->
              <div class="bg-[#0d0d0d] border border-[#242424] rounded p-3 space-y-2 mb-3 text-xs">
                <div *ngFor="let it of order.items" class="flex justify-between items-baseline text-neutral-300">
                  <div class="pr-2">
                    <span class="font-bold text-white">{{ it.quantity }}x</span> {{ it.itemName }}
                    <span *ngIf="it.variantName" class="text-neutral-500 text-[10px] block">Variant: {{ it.variantName }}</span>
                  </div>
                  <strong class="text-white font-serif">&#36;{{ it.itemTotal | number:'1.2-2' }}</strong>
                </div>
              </div>

              <!-- Total Breakdown -->
              <div class="flex justify-between items-baseline pt-2 border-t border-[#242424] text-xs">
                <span class="text-neutral-400">Total Bill:</span>
                <span class="text-base font-extrabold text-white font-serif">&#36;{{ order.totalAmount | number:'1.2-2' }}</span>
              </div>
            </div>

            <!-- Lifecycle Actions -->
            <div class="pt-3 border-t border-[#242424] flex gap-2.5">
              <!-- If PLACED: Accept or Reject -->
              <ng-container *ngIf="order.status === 'PLACED'">
                <button (click)="acceptOrder(order)" class="flex-1 py-2 bg-gold hover:bg-gold-light text-black font-extrabold text-xs uppercase tracking-wider rounded transition-all cursor-pointer shadow-md">
                  <i class="fa-solid fa-check mr-1"></i> ACCEPT
                </button>
                <button (click)="openRejectModal(order)" class="px-3.5 py-2 border border-neutral-700 text-rose-400 hover:border-rose-500 font-bold text-xs uppercase tracking-wider rounded hover:bg-rose-500/10 transition-all cursor-pointer">
                  <i class="fa-solid fa-xmark mr-1"></i> REJECT
                </button>
              </ng-container>

              <!-- If ACCEPTED: Start Preparing -->
              <ng-container *ngIf="order.status === 'ACCEPTED'">
                <button (click)="updateOrderStatus(order, 'PREPARING', 'Food in preparation')" class="w-full py-2 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider rounded transition-all cursor-pointer shadow-md">
                  <i class="fa-solid fa-fire-burner mr-1"></i> START PREPARING
                </button>
              </ng-container>

              <!-- If PREPARING: Ready for Pickup -->
              <ng-container *ngIf="order.status === 'PREPARING'">
                <button (click)="updateOrderStatus(order, 'READY_FOR_PICKUP', 'Ready at counter')" class="w-full py-2 bg-white hover:bg-neutral-200 text-black font-extrabold text-xs uppercase tracking-wider rounded transition-all cursor-pointer shadow-md">
                  <i class="fa-solid fa-box-archive mr-1"></i> READY FOR PICKUP
                </button>
              </ng-container>

              <ng-container *ngIf="order.status === 'READY_FOR_PICKUP'">
                <span class="text-xs text-neutral-400 flex items-center gap-2 py-1"><i class="fa-solid fa-motorcycle text-gold"></i> Awaiting courier pickup</span>
              </ng-container>

              <ng-container *ngIf="order.status === 'OUT_FOR_DELIVERY'">
                <span class="text-xs text-neutral-400 flex items-center gap-2 py-1"><i class="fa-solid fa-route text-sky-400"></i> Courier en route</span>
              </ng-container>

              <ng-container *ngIf="order.status === 'DELIVERED'">
                <span class="text-xs text-emerald-400 flex items-center gap-2 py-1"><i class="fa-solid fa-circle-check"></i> Completed & Delivered</span>
              </ng-container>

              <ng-container *ngIf="order.status === 'REJECTED'">
                <span class="text-xs text-rose-400 py-1">Declined: {{ order.rejectionReason }}</span>
              </ng-container>

              <ng-container *ngIf="order.status === 'CANCELLED'">
                <span class="text-xs text-neutral-500 py-1">Cancelled by customer</span>
              </ng-container>
            </div>
          </div>
        </div>

        <!-- REJECT ORDER MODAL (Customer Dialog Style) -->
        <div *ngIf="rejectingOrder" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div class="bg-[#141414] border border-[#242424] rounded w-full max-w-md shadow-2xl overflow-hidden">
            <div class="p-5 border-b border-[#242424] flex justify-between items-center">
              <div>
                <span class="text-[10px] font-extrabold uppercase tracking-[2px] text-rose-400 block mb-1">DECLINE TICKET</span>
                <h3 class="text-lg font-bold text-white">Reject Order #{{ rejectingOrder.orderNumber }}</h3>
              </div>
              <button (click)="rejectingOrder = null" class="text-neutral-500 hover:text-white cursor-pointer"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div class="p-6">
              <label class="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Reason for Declining *</label>
              <input type="text" [(ngModel)]="rejectionReason" class="w-full px-4 py-3 bg-[#0d0d0d] border border-[#242424] focus:border-gold rounded text-white text-xs outline-none transition-colors" placeholder="e.g. Kitchen at peak capacity / Key ingredient unavailable" />
            </div>
            <div class="p-5 border-t border-[#242424] flex justify-end gap-3">
              <button (click)="rejectingOrder = null" class="px-4 py-2 border border-neutral-700 hover:border-white text-neutral-300 hover:text-white text-xs font-bold uppercase rounded cursor-pointer transition-colors">
                Cancel
              </button>
              <button (click)="confirmRejectOrder()" class="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs uppercase tracking-wider rounded transition-all cursor-pointer disabled:opacity-40 shadow" [disabled]="!rejectionReason">
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  `
})
export class RestaurantOrdersComponent implements OnInit {
  restaurant: Restaurant | null = null;
  orders: Order[] = [];
  loading: boolean = false;
  selectedStatusFilter: string = 'ALL';
  searchQuery: string = '';

  rejectingOrder: Order | null = null;
  rejectionReason: string = '';

  filterOptions = [
    { label: 'All', value: 'ALL' },
    { label: 'New / Placed', value: 'PLACED' },
    { label: 'Accepted', value: 'ACCEPTED' },
    { label: 'Preparing', value: 'PREPARING' },
    { label: 'Ready for Pickup', value: 'READY_FOR_PICKUP' },
    { label: 'Delivered', value: 'DELIVERED' },
    { label: 'Rejected', value: 'REJECTED' }
  ];

  constructor(
    private restaurantService: RestaurantService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loadRestaurant();
    this.loadOrders();
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

  loadOrders(): void {
    this.loading = true;
    this.orderService.getRestaurantOrders().subscribe({
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

  get activeOrdersCount(): number {
    return this.orders.filter(o => 
      o.status === 'PLACED' || o.status === 'ACCEPTED' || o.status === 'PREPARING'
    ).length;
  }

  get filteredOrders(): Order[] {
    return this.orders.filter(o => {
      const matchesFilter = this.selectedStatusFilter === 'ALL' || o.status === this.selectedStatusFilter;
      const matchesSearch = !this.searchQuery || 
        o.orderNumber.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        o.customer?.fullName?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        o.deliveryAddressText?.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }

  getCountForFilter(status: string): number {
    if (status === 'ALL') return this.orders.length;
    return this.orders.filter(o => o.status === status).length;
  }

  resetFilters(): void {
    this.selectedStatusFilter = 'ALL';
    this.searchQuery = '';
    this.loadOrders();
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

  acceptOrder(order: Order): void {
    this.updateOrderStatus(order, 'ACCEPTED', 'Accepted by kitchen staff');
  }

  updateOrderStatus(order: Order, status: OrderStatus, note?: string): void {
    this.orderService.updateRestaurantOrderStatus(order.id, status, note).subscribe({
      next: res => {
        if (res.success) {
          this.loadOrders();
        }
      }
    });
  }

  openRejectModal(order: Order): void {
    this.rejectingOrder = order;
    this.rejectionReason = '';
  }

  confirmRejectOrder(): void {
    if (!this.rejectingOrder || !this.rejectionReason) return;
    this.orderService.rejectOrder(this.rejectingOrder.id, this.rejectionReason).subscribe({
      next: res => {
        this.rejectingOrder = null;
        this.loadOrders();
      }
    });
  }
}
