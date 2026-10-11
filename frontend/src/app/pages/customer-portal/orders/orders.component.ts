import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../services/order.service';
import { Order, OrderStatus } from '../../../models/order.models';
import { UserSidebarComponent } from '../../../components/user-sidebar/user-sidebar.component';

type OrderFilter = 'ALL' | 'ACTIVE' | 'DELIVERED' | 'CANCELLED';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, UserSidebarComponent],
  template: `
    <div class="bg-[#090909] min-h-[90vh] py-12 sm:py-16 text-neutral-200">
      <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Grid Layout: Sidebar Navigation + Orders Content -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          <!-- Left Column: User Sidebar Navigation -->
          <div class="lg:col-span-3">
            <app-user-sidebar></app-user-sidebar>
          </div>

          <!-- Right Column: Orders Content -->
          <div class="lg:col-span-9 space-y-6">

            <!-- Header -->
            <div class="mb-4">
              <span class="text-xs font-bold uppercase tracking-[2.5px] text-gold mb-3 inline-block">ORDERS & HISTORY</span>
              <h1 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">My Orders</h1>
            </div>

            <!-- ORDERS VIEW -->
            <div>
          
          <!-- Filter & Search Toolbar -->
          <div class="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-6">
            <!-- Filter Pills -->
            <div class="flex flex-wrap gap-2">
              <button (click)="currentFilter = 'ALL'"
                      [ngClass]="currentFilter === 'ALL' ? 'bg-white/10 text-white border-white/40' : 'bg-[#141414] text-neutral-400 border-[#242424] hover:text-white'"
                      class="px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded border transition-all cursor-pointer">
                All ({{ orders.length }})
              </button>
              <button (click)="currentFilter = 'ACTIVE'"
                      [ngClass]="currentFilter === 'ACTIVE' ? 'bg-amber-500/15 text-amber-300 border-amber-500/40' : 'bg-[#141414] text-neutral-400 border-[#242424] hover:text-white'"
                      class="px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded border transition-all cursor-pointer flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                In-Progress ({{ activeCount }})
              </button>
              <button (click)="currentFilter = 'DELIVERED'"
                      [ngClass]="currentFilter === 'DELIVERED' ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40' : 'bg-[#141414] text-neutral-400 border-[#242424] hover:text-white'"
                      class="px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded border transition-all cursor-pointer flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Delivered ({{ deliveredCount }})
              </button>
              <button (click)="currentFilter = 'CANCELLED'"
                      [ngClass]="currentFilter === 'CANCELLED' ? 'bg-rose-500/15 text-rose-300 border-rose-500/40' : 'bg-[#141414] text-neutral-400 border-[#242424] hover:text-white'"
                      class="px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded border transition-all cursor-pointer flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                Cancelled ({{ cancelledCount }})
              </button>
            </div>

            <!-- Search Bar -->
            <div class="relative min-w-[260px] md:w-80">
              <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 text-xs"></i>
              <input type="text" 
                     [(ngModel)]="searchQuery" 
                     placeholder="Search by #order, dish, or restaurant..." 
                     class="w-full pl-9 pr-8 py-2 bg-[#141414] border border-[#242424] rounded text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-gold transition-colors" />
              <button *ngIf="searchQuery" 
                      (click)="searchQuery = ''" 
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white text-xs">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>

          <!-- Loading State -->
          <div *ngIf="loadingOrders" class="bg-[#141414] border border-[#242424] rounded p-20 text-center">
            <div class="w-10 h-10 border-2 border-neutral-700 border-t-gold rounded-full animate-spin mx-auto mb-4"></div>
            <h3 class="text-base font-bold text-white mb-1">Retrieving Your Culinary Archive</h3>
            <p class="text-xs text-neutral-400">Connecting to secure UrbanBite dispatch services...</p>
          </div>

          <!-- Empty State (No orders placed ever) -->
          <div *ngIf="!loadingOrders && orders.length === 0" 
               class="bg-[#141414] border border-[#242424] rounded p-16 text-center max-w-xl mx-auto shadow-2xl">
            <div class="w-20 h-20 rounded bg-[#1b1b1b] border border-[#2f2f2f] flex items-center justify-center mx-auto mb-6 text-neutral-500">
              <i class="fa-solid fa-receipt text-3xl text-gold/80"></i>
            </div>
            <span class="text-xs font-bold uppercase tracking-[2px] text-gold block mb-2">No Past Orders Found</span>
            <h3 class="text-2xl font-bold text-white mb-3">Your Gourmet Journey Awaits</h3>
            <p class="text-xs text-neutral-400 max-w-md mx-auto mb-8 leading-relaxed">
              You haven't placed any culinary orders yet. Explore our premier selection of artisanal kitchens and fine dining experiences.
            </p>
            <a routerLink="/restaurants" 
               class="inline-flex items-center gap-2 px-8 py-3.5 bg-gold hover:bg-gold-light text-black font-extrabold text-xs uppercase tracking-wider rounded transition-all shadow-lg hover:shadow-gold/20">
              <i class="fa-solid fa-utensils"></i>
              <span>Discover Restaurants</span>
            </a>
          </div>

          <!-- Filter / Search Yielded 0 Matches -->
          <div *ngIf="!loadingOrders && orders.length > 0 && filteredOrders.length === 0" 
               class="bg-[#141414] border border-[#242424] rounded p-16 text-center max-w-md mx-auto">
            <i class="fa-solid fa-filter-circle-xmark text-4xl text-neutral-600 mb-4 block"></i>
            <h4 class="text-lg font-bold text-white mb-2">No Matching Orders Found</h4>
            <p class="text-xs text-neutral-400 mb-6">No orders match the selected filter or search term "{{ searchQuery }}".</p>
            <button (click)="resetFilters()" 
                    class="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider rounded border border-neutral-700 transition-colors">
              Clear Filters
            </button>
          </div>

          <!-- Orders List -->
          <div *ngIf="!loadingOrders && filteredOrders.length > 0" class="space-y-6">
            <div *ngFor="let order of filteredOrders" 
                 class="bg-[#141414] border border-[#242424] hover:border-neutral-700/80 rounded p-6 sm:p-7 transition-all duration-200 shadow-xl relative overflow-hidden group">
              
              <!-- Left accent bar for active orders -->
              <div *ngIf="isActiveStatus(order.status)" class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 to-gold"></div>

              <!-- Top Bar: Order ID, Date, Copy button & Status Badge -->
              <div class="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#222]">
                <div class="flex flex-wrap items-center gap-3">
                  <div class="flex items-center gap-2">
                    <span class="text-xs text-neutral-500 font-bold uppercase tracking-wider">Order</span>
                    <span class="font-extrabold text-white text-base tracking-tight font-mono">#{{ order.orderNumber }}</span>
                    <button (click)="copyOrderNumber(order.orderNumber)" 
                            [title]="'Copy ' + order.orderNumber"
                            class="text-neutral-500 hover:text-gold transition-colors text-xs p-1">
                      <i class="fa-regular fa-copy" *ngIf="copiedOrderNumber !== order.orderNumber"></i>
                      <i class="fa-solid fa-check text-emerald-400" *ngIf="copiedOrderNumber === order.orderNumber"></i>
                    </button>
                  </div>
                  <span class="text-neutral-600 hidden sm:inline">•</span>
                  <span class="text-xs text-neutral-400 flex items-center gap-1.5">
                    <i class="fa-regular fa-calendar text-[11px] text-neutral-500"></i>
                    {{ order.createdAt | date:'medium' }}
                  </span>
                </div>

                <!-- Status Badge -->
                <div class="flex items-center gap-2">
                  <span class="text-[11px] font-extrabold tracking-wider px-3 py-1 rounded uppercase border flex items-center gap-1.5"
                        [ngClass]="getStatusClasses(order.status)">
                    <span *ngIf="isActiveStatus(order.status)" class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                    <i *ngIf="order.status === 'DELIVERED'" class="fa-solid fa-check text-[10px]"></i>
                    <i *ngIf="order.status === 'CANCELLED' || order.status === 'REJECTED'" class="fa-solid fa-xmark text-[10px]"></i>
                    <span>{{ formatStatus(order.status) }}</span>
                  </span>
                </div>
              </div>

              <!-- Main Content: Restaurant Info & Items Grid -->
              <div class="py-5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                <!-- Left: Restaurant and Ordered Items (Col 1-8) -->
                <div class="lg:col-span-8 space-y-4">
                  <!-- Restaurant header -->
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded bg-[#1b1b1b] border border-[#2f2f2f] flex items-center justify-center text-gold">
                        <i class="fa-solid fa-utensils"></i>
                      </div>
                      <div>
                        <h4 class="text-base font-bold text-white group-hover:text-gold transition-colors">
                          {{ order.restaurant?.name || 'Artisanal Kitchen' }}
                        </h4>
                        <p class="text-xs text-neutral-400">
                          {{ order.restaurant?.cuisine || 'Fine Dining' }} • {{ order.restaurant?.city || 'UrbanBite Loft' }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Ordered Items List -->
                  <div class="bg-[#0f0f0f] border border-[#1e1e1e] rounded p-4 space-y-2.5">
                    <div *ngFor="let item of order.items" class="flex items-start justify-between text-xs py-1">
                      <div class="flex items-start gap-2.5">
                        <span class="w-5 h-5 rounded bg-[#1e1e1e] text-gold font-extrabold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {{ item.quantity }}x
                        </span>
                        <div>
                          <span class="font-semibold text-white">{{ item.itemName }}</span>
                          <span *ngIf="item.variantName" class="text-[10px] text-neutral-400 ml-1.5">({{ item.variantName }})</span>
                          <p *ngIf="item.addonsSummary" class="text-[11px] text-neutral-500 mt-0.5">
                            + {{ item.addonsSummary }}
                          </p>
                        </div>
                      </div>
                      <span class="font-mono text-neutral-300 font-semibold shrink-0 ml-3">
                        &#36;{{ item.itemTotal | number:'1.2-2' }}
                      </span>
                    </div>
                  </div>

                  <!-- Delivery Residence -->
                  <div class="flex items-start gap-2 text-xs text-neutral-400 pt-1">
                    <i class="fa-solid fa-map-pin text-gold mt-0.5 shrink-0"></i>
                    <span>Delivery destination: <strong class="text-neutral-200">{{ order.deliveryAddressText || 'Default Address' }}</strong></span>
                  </div>
                </div>

                <!-- Right: Financial Summary & Payment Info (Col 9-12) -->
                <div class="lg:col-span-4 bg-[#0d0d0d] border border-[#202020] rounded p-4 space-y-2.5 text-xs">
                  <div class="flex justify-between text-neutral-400">
                    <span>Subtotal</span>
                    <span class="font-mono text-neutral-200">&#36;{{ order.subtotal | number:'1.2-2' }}</span>
                  </div>
                  <div class="flex justify-between text-neutral-400" *ngIf="order.discountAmount > 0">
                    <span class="text-emerald-400">Discount</span>
                    <span class="font-mono text-emerald-400">-&#36;{{ order.discountAmount | number:'1.2-2' }}</span>
                  </div>
                  <div class="flex justify-between text-neutral-400">
                    <span>Delivery Fee</span>
                    <span class="font-mono text-neutral-200">&#36;{{ order.deliveryFee | number:'1.2-2' }}</span>
                  </div>
                  <div class="flex justify-between text-neutral-400">
                    <span>Tax & Service</span>
                    <span class="font-mono text-neutral-200">&#36;{{ order.taxAmount | number:'1.2-2' }}</span>
                  </div>
                  <div class="border-t border-[#242424] pt-2.5 flex justify-between items-center text-sm">
                    <span class="font-bold text-white uppercase tracking-wider text-xs">Total Amount</span>
                    <span class="font-extrabold text-gold text-base font-mono">&#36;{{ order.totalAmount | number:'1.2-2' }}</span>
                  </div>

                  <!-- Payment Details -->
                  <div class="pt-2 border-t border-[#1a1a1a] flex items-center justify-between text-[11px] text-neutral-400">
                    <span class="flex items-center gap-1.5">
                      <i class="fa-regular fa-credit-card text-gold"></i>
                      <span>{{ order.paymentMethod ? order.paymentMethod.replace('_', ' ') : 'CREDIT CARD' }}</span>
                    </span>
                    <span class="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded"
                          [ngClass]="order.paymentStatus === 'PAID' ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40' : 'bg-neutral-800 text-neutral-300'">
                      {{ order.paymentStatus || 'COMPLETED' }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Bottom Bar Actions -->
              <div class="pt-5 border-t border-[#222] flex flex-wrap items-center justify-between gap-3">
                <div class="text-xs text-neutral-500">
                  <span *ngIf="order.items.length === 1">1 curated specialty</span>
                  <span *ngIf="order.items.length > 1">{{ order.items.length }} curated specialties</span>
                  <span *ngIf="order.customerNotes" class="ml-2 italic text-neutral-400">
                    "{{ order.customerNotes }}"
                  </span>
                </div>

                <!-- Action Button Group -->
                <div class="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                  
                  <!-- CANCEL BUTTON (Only allowed for PLACED orders) -->
                  <button *ngIf="order.status === 'PLACED'" 
                          (click)="openCancelModal(order)" 
                          class="px-4 py-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 hover:text-rose-300 border border-rose-800/40 text-xs font-bold uppercase tracking-wider rounded transition-all cursor-pointer">
                    <i class="fa-solid fa-xmark mr-1"></i> Cancel
                  </button>

                  <!-- TRACK STATUS BUTTON -->
                  <a [routerLink]="['/orders', order.orderNumber]" 
                     class="px-5 py-2 bg-[#1c1c1c] hover:bg-white hover:text-black border border-[#333] hover:border-white text-white font-extrabold text-xs uppercase tracking-wider rounded transition-all text-center flex items-center gap-1.5 shadow-sm">
                    <i class="fa-solid fa-location-crosshairs text-gold"></i>
                    <span>Live Tracking</span>
                  </a>

                  <!-- RATE & REVIEW BUTTON (Delivered) -->
                  <button *ngIf="order.status === 'DELIVERED'" 
                          (click)="openReviewModal(order)" 
                          class="px-5 py-2 bg-gold hover:bg-gold-light text-black font-extrabold text-xs uppercase tracking-wider rounded transition-all cursor-pointer flex items-center gap-1.5 shadow-sm">
                    <i class="fa-solid fa-star"></i>
                    <span>Rate Experience</span>
                  </button>

                  <!-- RE-ORDER / VISIT RESTAURANT -->
                  <a *ngIf="order.restaurant?.id" 
                     [routerLink]="['/restaurants', order.restaurant!.id]" 
                     class="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-[#2c2c2c] text-xs font-bold uppercase tracking-wider rounded transition-all text-center">
                    <i class="fa-solid fa-repeat mr-1 text-gold"></i> Re-Order
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

        <!-- ============================================== -->
        <!-- RATE & REVIEW MODAL -->
        <!-- ============================================== -->
        <div *ngIf="reviewModalOrder" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div class="bg-[#141414] border border-[#333] rounded w-full max-w-lg shadow-2xl overflow-hidden">
            
            <div class="p-6 border-b border-[#242424] flex justify-between items-start">
              <div>
                <span class="text-[10px] font-extrabold uppercase tracking-[2px] text-gold block mb-1">GASTRONOMIC CRITIQUE</span>
                <h3 class="text-xl font-bold text-white">Rate Your Dining Experience</h3>
                <p class="text-xs text-neutral-400 mt-0.5">Order #{{ reviewModalOrder.orderNumber }} • {{ reviewModalOrder.restaurant?.name }}</p>
              </div>
              <button (click)="reviewModalOrder = null" class="text-neutral-500 hover:text-white cursor-pointer text-lg p-1">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div class="p-6 space-y-5">
              <!-- Star Selector -->
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Overall Culinary Score</label>
                <div class="flex items-center gap-2">
                  <button *ngFor="let s of [1,2,3,4,5]" 
                          type="button"
                          (click)="reviewRating = s" 
                          class="text-3xl cursor-pointer transition-transform hover:scale-110 active:scale-95" 
                          [ngClass]="s <= reviewRating ? 'text-gold' : 'text-neutral-700'">
                    <i class="fa-solid fa-star"></i>
                  </button>
                  <span class="ml-3 text-xs font-bold text-neutral-300">
                    {{ reviewRating === 5 ? '5.0 - Exceptional' : reviewRating === 4 ? '4.0 - Very Good' : reviewRating === 3 ? '3.0 - Satisfactory' : reviewRating === 2 ? '2.0 - Subpar' : '1.0 - Needs Improvement' }}
                  </span>
                </div>
              </div>

              <!-- Comments -->
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Detailed Impressions & Dish Notes</label>
                <textarea [(ngModel)]="reviewComment" 
                          rows="4"
                          class="w-full px-4 py-3 bg-[#0d0d0d] border border-[#242424] rounded text-white text-xs outline-none focus:border-gold transition-colors resize-none placeholder-neutral-600" 
                          placeholder="Describe the aroma, temperature, presentation, and culinary craft..."></textarea>
              </div>

              <div *ngIf="reviewSuccessMsg" class="p-3.5 bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs rounded flex items-center gap-2">
                <i class="fa-solid fa-circle-check"></i>
                <span>{{ reviewSuccessMsg }}</span>
              </div>
              <div *ngIf="reviewErrorMsg" class="p-3.5 bg-rose-950/60 border border-rose-500/40 text-rose-400 text-xs rounded flex items-center gap-2">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <span>{{ reviewErrorMsg }}</span>
              </div>
            </div>

            <div class="p-6 border-t border-[#242424] flex items-center justify-end gap-3 bg-[#0f0f0f]">
              <button (click)="reviewModalOrder = null" 
                      class="px-5 py-2.5 bg-transparent hover:bg-white/5 text-neutral-400 hover:text-white text-xs font-bold uppercase tracking-wider rounded transition-colors cursor-pointer">
                Cancel
              </button>
              <button (click)="submitReview()" 
                      [disabled]="submittingReview"
                      class="px-6 py-2.5 bg-gold hover:bg-gold-light text-black font-extrabold text-xs uppercase tracking-wider rounded transition-all cursor-pointer disabled:opacity-40 shadow-md">
                {{ submittingReview ? 'Publishing...' : 'Publish Critique' }}
              </button>
            </div>
          </div>
        </div>

        <!-- ============================================== -->
        <!-- CANCEL ORDER CONFIRMATION MODAL -->
        <!-- ============================================== -->
        <div *ngIf="cancelModalOrder" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div class="bg-[#141414] border border-[#333] rounded w-full max-w-md shadow-2xl overflow-hidden">
            <div class="p-6 border-b border-[#242424] flex justify-between items-start">
              <div>
                <h3 class="text-xl font-bold text-white">Cancel Order #{{ cancelModalOrder.orderNumber }}</h3>
                <p class="text-xs text-neutral-400 mt-1">Are you sure you wish to cancel this request?</p>
              </div>
              <button (click)="cancelModalOrder = null" class="text-neutral-500 hover:text-white cursor-pointer text-lg p-1">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div class="p-6 space-y-4">
              <p class="text-xs text-neutral-300 leading-relaxed">
                Orders can only be cancelled while in the initial placement status. Once kitchen preparation begins, cancellations cannot be processed.
              </p>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Reason for cancellation (optional)</label>
                <input type="text" 
                       [(ngModel)]="cancelReason" 
                       placeholder="e.g. Changed dinner plans, incorrect address" 
                       class="w-full px-4 py-2.5 bg-[#0d0d0d] border border-[#242424] rounded text-white text-xs outline-none focus:border-white transition-colors" />
              </div>
              <div *ngIf="cancelErrorMsg" class="p-3 bg-rose-950/60 border border-rose-500/40 text-rose-400 text-xs rounded">
                {{ cancelErrorMsg }}
              </div>
            </div>

            <div class="p-6 border-t border-[#242424] flex items-center justify-end gap-3 bg-[#0f0f0f]">
              <button (click)="cancelModalOrder = null" 
                      class="px-5 py-2.5 bg-transparent text-neutral-400 hover:text-white text-xs font-bold uppercase tracking-wider rounded transition-colors cursor-pointer">
                Keep Order
              </button>
              <button (click)="confirmCancelOrder()" 
                      [disabled]="isCancelling"
                      class="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs uppercase tracking-wider rounded transition-all cursor-pointer disabled:opacity-40">
                {{ isCancelling ? 'Cancelling...' : 'Confirm Cancellation' }}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  `
})
export class OrdersComponent implements OnInit {
  currentFilter: OrderFilter = 'ALL';
  searchQuery: string = '';

  orders: Order[] = [];
  loadingOrders: boolean = true;
  copiedOrderNumber: string | null = null;

  // Review modal state
  reviewModalOrder: Order | null = null;
  reviewRating: number = 5;
  reviewComment: string = '';
  submittingReview: boolean = false;
  reviewSuccessMsg: string = '';
  reviewErrorMsg: string = '';

  // Cancel modal state
  cancelModalOrder: Order | null = null;
  cancelReason: string = '';
  isCancelling: boolean = false;
  cancelErrorMsg: string = '';

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  // --- STAT CALCULATIONS ---
  get activeCount(): number {
    return this.orders.filter(o => this.isActiveStatus(o.status)).length;
  }

  get deliveredCount(): number {
    return this.orders.filter(o => o.status === 'DELIVERED').length;
  }

  get cancelledCount(): number {
    return this.orders.filter(o => o.status === 'CANCELLED' || o.status === 'REJECTED').length;
  }

  get totalSpend(): number {
    return this.orders
      .filter(o => o.status !== 'CANCELLED' && o.status !== 'REJECTED')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  }

  // --- FILTERED ORDERS ---
  get filteredOrders(): Order[] {
    let result = [...this.orders];

    // Status filter
    if (this.currentFilter === 'ACTIVE') {
      result = result.filter(o => this.isActiveStatus(o.status));
    } else if (this.currentFilter === 'DELIVERED') {
      result = result.filter(o => o.status === 'DELIVERED');
    } else if (this.currentFilter === 'CANCELLED') {
      result = result.filter(o => o.status === 'CANCELLED' || o.status === 'REJECTED');
    }

    // Text search filter
    if (this.searchQuery && this.searchQuery.trim().length > 0) {
      const q = this.searchQuery.toLowerCase().trim();
      result = result.filter(o => {
        const matchesNumber = o.orderNumber?.toLowerCase().includes(q);
        const matchesRestaurant = o.restaurant?.name?.toLowerCase().includes(q);
        const matchesItems = o.items?.some(it => it.itemName?.toLowerCase().includes(q));
        return matchesNumber || matchesRestaurant || matchesItems;
      });
    }

    return result;
  }

  resetFilters(): void {
    this.currentFilter = 'ALL';
    this.searchQuery = '';
  }

  // --- API LOADERS ---
  loadOrders(): void {
    this.loadingOrders = true;
    this.orderService.getMyOrders().subscribe({
      next: res => {
        this.loadingOrders = false;
        if (res.success && res.data) {
          // Sort by creation date descending
          this.orders = res.data.sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        } else {
          this.orders = [];
        }
      },
      error: () => {
        this.loadingOrders = false;
        this.orders = [];
      }
    });
  }

  // --- STATUS HELPERS ---
  isActiveStatus(status: OrderStatus): boolean {
    return status === 'PLACED' ||
      status === 'ACCEPTED' ||
      status === 'PREPARING' ||
      status === 'READY_FOR_PICKUP' ||
      status === 'OUT_FOR_DELIVERY';
  }

  formatStatus(status: string): string {
    if (!status) return '';
    return status.replace(/_/g, ' ');
  }

  getStatusClasses(status: OrderStatus): string {
    switch (status) {
      case 'DELIVERED':
        return 'border-emerald-500/40 bg-emerald-950/40 text-emerald-400';
      case 'CANCELLED':
      case 'REJECTED':
        return 'border-rose-500/40 bg-rose-950/40 text-rose-400';
      case 'OUT_FOR_DELIVERY':
        return 'border-amber-400/50 bg-amber-950/40 text-amber-300';
      default:
        return 'border-gold/40 bg-gold/10 text-gold';
    }
  }

  copyOrderNumber(num: string): void {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(num).then(() => {
        this.copiedOrderNumber = num;
        setTimeout(() => {
          this.copiedOrderNumber = null;
        }, 2000);
      });
    }
  }

  // --- REVIEW METHODS ---
  openReviewModal(order: Order): void {
    this.reviewModalOrder = order;
    this.reviewRating = 5;
    this.reviewComment = '';
    this.reviewSuccessMsg = '';
    this.reviewErrorMsg = '';
  }

  submitReview(): void {
    if (!this.reviewModalOrder) return;
    this.submittingReview = true;
    this.reviewErrorMsg = '';

    this.orderService.submitReview(this.reviewModalOrder.id, this.reviewRating, this.reviewComment).subscribe({
      next: res => {
        this.submittingReview = false;
        if (res.success) {
          this.reviewSuccessMsg = 'Thank you! Your critique has been recorded.';
          setTimeout(() => {
            this.reviewModalOrder = null;
          }, 1500);
        } else {
          this.reviewErrorMsg = res.message || 'Could not submit critique.';
        }
      },
      error: err => {
        this.submittingReview = false;
        this.reviewErrorMsg = err.error?.message || 'Failed to submit critique.';
      }
    });
  }

  // --- CANCEL METHODS ---
  openCancelModal(order: Order): void {
    this.cancelModalOrder = order;
    this.cancelReason = '';
    this.cancelErrorMsg = '';
  }

  confirmCancelOrder(): void {
    if (!this.cancelModalOrder) return;
    this.isCancelling = true;
    this.cancelErrorMsg = '';

    this.orderService.cancelOrder(this.cancelModalOrder.id, this.cancelReason || 'Cancelled by customer').subscribe({
      next: res => {
        this.isCancelling = false;
        if (res.success) {
          this.cancelModalOrder = null;
          this.loadOrders();
        } else {
          this.cancelErrorMsg = res.message || 'Could not cancel order.';
        }
      },
      error: err => {
        this.isCancelling = false;
        this.cancelErrorMsg = err.error?.message || 'Failed to cancel order.';
      }
    });
  }
}
