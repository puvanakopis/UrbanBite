import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { DeliveryService } from '../../../services/delivery.service';
import { Order } from '../../../models/order.models';
import { DeliveryAssignment, EarningsSummary } from '../../../models/delivery.models';

export type DeliveryTab = 'ALL' | 'REQUESTS' | 'ACTIVE' | 'HISTORY';

@Component({
  selector: 'app-delivery-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="bg-[#090909] min-h-[90vh] py-12 sm:py-16 text-neutral-200">
      <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Customer-Style Page Header (Matching Restaurant Orders) -->
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-4 border-b border-[#242424]">
          <div>
            <span class="text-xs font-bold uppercase tracking-[2.5px] text-gold mb-2 block">
              DISPATCH & FULFILLMENT PORTAL
            </span>
            <div class="flex items-center gap-3">
              <h1 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Order Management
              </h1>
            </div>
          </div>

          <!-- Header Actions (Matching Restaurant Header Actions) -->
          <div class="flex items-center gap-3">
            <button 
              (click)="loadAllData()" 
              class="px-4 py-2 border border-neutral-700 hover:border-white text-neutral-300 hover:text-white rounded text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2">
              <i class="fa-solid fa-arrows-rotate" [ngClass]="{'fa-spin': loading}"></i>
              <span>Refresh</span>
            </button>

            <a 
              routerLink="/delivery-portal/earnings" 
              class="px-5 py-2.5 bg-gold hover:bg-gold-light text-black font-extrabold text-xs uppercase tracking-wider rounded transition-all cursor-pointer shadow-md flex items-center gap-2">
              <i class="fa-solid fa-wallet"></i>
              <span>Earnings Ledger</span>
            </a>
          </div>
        </div>

        <!-- Attention Banner for Active / Available Orders (Restaurant Style) -->
        <div *ngIf="availableOrders.length > 0 && currentTab !== 'REQUESTS'" 
             class="mb-8 p-4 bg-gold/10 border border-gold/40 rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div class="flex items-center gap-3 text-gold">
            <div class="w-9 h-9 rounded bg-gold/20 flex items-center justify-center shrink-0">
              <i class="fa-solid fa-bell text-base animate-bounce"></i>
            </div>
            <div>
              <h4 class="font-bold text-sm text-white">Action Required: {{ availableOrders.length }} Ready Order{{ availableOrders.length > 1 ? 's' : '' }} Waiting</h4>
              <p class="text-xs text-neutral-300">New kitchen tickets are packed and awaiting courier claim.</p>
            </div>
          </div>
          <button (click)="currentTab = 'REQUESTS'" class="px-4 py-2 bg-gold hover:bg-gold-light text-black font-bold text-xs uppercase tracking-wider rounded transition-all whitespace-nowrap shadow cursor-pointer">
            Claim Orders
          </button>
        </div>

        <!-- Metric KPI Cards Strip (Matching Restaurant Dashboard) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div class="bg-[#141414] border border-[#242424] rounded p-6 shadow-xl flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
            <div class="flex justify-between items-start mb-3">
              <span class="text-[11px] font-bold tracking-wider uppercase text-emerald-400">
                ACTIVE DELIVERIES
              </span>
              <i class="fa-solid fa-route text-xs text-emerald-400"></i>
            </div>
            <span class="text-3xl font-extrabold text-white font-serif mb-1">{{ activeTasks.length }}</span>
            <span class="text-xs text-neutral-500">In transit or claimed</span>
          </div>

          <div class="bg-[#141414] border border-[#242424] rounded p-6 shadow-xl flex flex-col justify-between hover:border-gold/40 transition-colors">
            <div class="flex justify-between items-start mb-3">
              <span class="text-[11px] font-bold tracking-wider uppercase text-gold">
                AVAILABLE REQUESTS
              </span>
              <i class="fa-solid fa-boxes-packing text-xs text-gold"></i>
            </div>
            <span class="text-3xl font-extrabold font-serif mb-1 text-gold">
              {{ availableOrders.length }}
            </span>
            <span class="text-xs text-neutral-500">Ready for pickup at counter</span>
          </div>

          <div class="bg-[#141414] border border-[#242424] rounded p-6 shadow-xl flex flex-col justify-between hover:border-blue-500/40 transition-colors">
            <div class="flex justify-between items-start mb-3">
              <span class="text-[11px] font-bold tracking-wider uppercase text-neutral-400">
                FULFILLED DELIVERIES
              </span>
              <i class="fa-solid fa-circle-check text-xs text-neutral-500"></i>
            </div>
            <span class="text-3xl font-extrabold text-white font-serif mb-1">{{ completedTasks.length }}</span>
            <span class="text-xs text-neutral-500">Lifetime completed dispatches</span>
          </div>

          <div class="bg-[#141414] border border-[#242424] rounded p-6 shadow-xl flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
            <div class="flex justify-between items-start mb-3">
              <span class="text-[11px] font-bold tracking-wider text-neutral-400 uppercase">GROSS EARNINGS</span>
              <i class="fa-solid fa-dollar-sign text-xs text-emerald-400"></i>
            </div>
            <span class="text-3xl font-extrabold text-emerald-400 font-serif mb-1">
              &#36;{{ (earnings?.totalEarnings || 0) | number:'1.2-2' }}
            </span>
            <span class="text-xs text-neutral-500">&#36;{{ (earnings?.ratePerDelivery || 4.50) | number:'1.2-2' }} fixed rate</span>
          </div>
        </div>

        <!-- Filter & Search Toolbar (Customer & Restaurant Orders Style) -->
        <div class="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-6">
          
          <!-- Dropdowns Group: Category Filter + Sub-Filter -->
          <div class="flex flex-wrap items-center gap-3">
            
            <!-- Category Dropdown Selector (The 3 Filters + All) -->
            <div class="relative min-w-[220px] sm:w-64">
              <div class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold text-xs pointer-events-none">
                <i class="fa-solid fa-filter"></i>
              </div>
              <select 
                [(ngModel)]="currentTab" 
                (change)="onTabChange()"
                class="w-full pl-9 pr-9 py-2 bg-[#141414] border border-[#242424] rounded text-xs text-white focus:outline-none focus:border-gold transition-colors appearance-none cursor-pointer font-bold tracking-wider uppercase">
                <option value="REQUESTS" class="bg-[#141414] text-white">Requests ({{ availableOrders.length }})</option>
                <option value="ACTIVE" class="bg-[#141414] text-white">Active Tasks ({{ activeTasks.length }})</option>
                <option value="HISTORY" class="bg-[#141414] text-white">Delivery History ({{ completedTasks.length }})</option>
                <option value="ALL" class="bg-[#141414] text-white">All Orders ({{ totalOrdersCount }})</option>
              </select>
              <div class="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-[10px] pointer-events-none">
                <i class="fa-solid fa-chevron-down"></i>
              </div>
            </div>

            <!-- Contextual Secondary Dropdown (Zone / Stage / Time Range) -->
            <div *ngIf="currentTab === 'REQUESTS'" class="relative min-w-[180px] sm:w-56">
              <div class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold text-xs pointer-events-none">
                <i class="fa-solid fa-location-dot"></i>
              </div>
              <select 
                [(ngModel)]="selectedZoneFilter" 
                class="w-full pl-9 pr-9 py-2 bg-[#141414] border border-[#242424] rounded text-xs text-white focus:outline-none focus:border-gold transition-colors appearance-none cursor-pointer font-bold tracking-wider uppercase">
                <option value="ALL" class="bg-[#141414] text-white">All Delivery Zones</option>
                <option value="DOWNTOWN" class="bg-[#141414] text-white">Downtown & SoHo</option>
                <option value="MIDTOWN" class="bg-[#141414] text-white">Midtown & Chelsea</option>
                <option value="EAST_SIDE" class="bg-[#141414] text-white">East Side & Village</option>
              </select>
              <div class="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-[10px] pointer-events-none">
                <i class="fa-solid fa-chevron-down"></i>
              </div>
            </div>

            <div *ngIf="currentTab === 'ACTIVE'" class="relative min-w-[180px] sm:w-56">
              <div class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold text-xs pointer-events-none">
                <i class="fa-solid fa-list-check"></i>
              </div>
              <select 
                [(ngModel)]="selectedActiveStatusFilter" 
                class="w-full pl-9 pr-9 py-2 bg-[#141414] border border-[#242424] rounded text-xs text-white focus:outline-none focus:border-gold transition-colors appearance-none cursor-pointer font-bold tracking-wider uppercase">
                <option value="ALL" class="bg-[#141414] text-white">All Active Stages</option>
                <option value="ACCEPTED" class="bg-[#141414] text-white">1. Claimed / At Kitchen</option>
                <option value="PICKED_UP" class="bg-[#141414] text-white">2. Picked Up (Secured)</option>
                <option value="ON_THE_WAY" class="bg-[#141414] text-white">3. In Transit (Out)</option>
              </select>
              <div class="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-[10px] pointer-events-none">
                <i class="fa-solid fa-chevron-down"></i>
              </div>
            </div>

            <div *ngIf="currentTab === 'HISTORY'" class="relative min-w-[180px] sm:w-56">
              <div class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold text-xs pointer-events-none">
                <i class="fa-solid fa-calendar"></i>
              </div>
              <select 
                [(ngModel)]="selectedHistoryTimeFilter" 
                class="w-full pl-9 pr-9 py-2 bg-[#141414] border border-[#242424] rounded text-xs text-white focus:outline-none focus:border-gold transition-colors appearance-none cursor-pointer font-bold tracking-wider uppercase">
                <option value="ALL" class="bg-[#141414] text-white">All Completed Trips</option>
                <option value="TODAY" class="bg-[#141414] text-white">Fulfilled Today</option>
                <option value="THIS_WEEK" class="bg-[#141414] text-white">Past 7 Days</option>
              </select>
              <div class="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-[10px] pointer-events-none">
                <i class="fa-solid fa-chevron-down"></i>
              </div>
            </div>

            <!-- Showing Count Badge (Matching Restaurant Orders) -->
            <span class="hidden md:inline-flex items-center px-2.5 py-1.5 text-[11px] font-bold text-neutral-400 bg-[#141414] border border-[#242424] rounded">
              Showing {{ currentFilteredCount }} of {{ currentTotalCount }}
            </span>
          </div>

          <!-- Search Bar (Matching Restaurant Orders) -->
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

        <!-- Feedback Alert Banner -->
        <div *ngIf="feedbackMessage" 
             class="mb-6 p-4 bg-emerald-950/60 border border-emerald-500/40 rounded text-emerald-400 text-xs flex items-center justify-between gap-4 animate-fadeIn">
          <div class="flex items-center gap-2.5">
            <i class="fa-solid fa-circle-check text-sm"></i>
            <span class="font-bold">{{ feedbackMessage }}</span>
          </div>
          <button (click)="feedbackMessage = ''" class="text-emerald-400 hover:text-white text-xs cursor-pointer">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- Loading State (Matching Restaurant Loading State) -->
        <div *ngIf="loading" class="bg-[#141414] border border-[#242424] rounded p-20 text-center mb-8">
          <div class="w-10 h-10 border-2 border-neutral-700 border-t-gold rounded-full animate-spin mx-auto mb-4"></div>
          <h3 class="text-base font-bold text-white mb-1">Updating Delivery Orders</h3>
          <p class="text-xs text-neutral-400">Syncing with live dispatch server...</p>
        </div>

        <!-- ======================================================== -->
        <!-- VIEW 1: REQUESTS VIEW -->
        <!-- ======================================================== -->
        <div *ngIf="!loading && (currentTab === 'REQUESTS' || currentTab === 'ALL')" class="mb-12">
          
          <div class="flex items-center justify-between pb-3 mb-6 border-b border-[#242424]">
            <div class="flex items-center gap-3">
              <span class="text-xs font-bold uppercase tracking-[2px] text-gold block">
                AVAILABLE KITCHEN REQUESTS
              </span>
              <span class="px-2 py-0.5 text-[10px] font-bold rounded bg-gold/15 text-gold border border-gold/30">
                {{ filteredRequests.length }} Available
              </span>
            </div>
            <span *ngIf="currentTab === 'ALL'" (click)="currentTab = 'REQUESTS'" class="text-xs font-bold text-gold hover:underline cursor-pointer flex items-center gap-1.5">
              <span>Focus Requests</span>
              <i class="fa-solid fa-arrow-right text-[10px]"></i>
            </span>
          </div>

          <!-- Empty State (Matching Restaurant Empty State) -->
          <div *ngIf="filteredRequests.length === 0" 
               class="bg-[#141414] border border-[#242424] rounded p-16 text-center text-neutral-500 text-xs shadow-xl mb-6">
            <div class="w-16 h-16 rounded bg-[#1b1b1b] border border-[#282828] mx-auto flex items-center justify-center text-gold/80 text-2xl mb-4">
              <i class="fa-solid fa-receipt"></i>
            </div>
            <p class="font-bold text-white text-base">No delivery requests found</p>
            <p class="text-xs text-neutral-400 mt-1 mb-4">
              {{ searchQuery ? 'No kitchen requests match your search query.' : 'All current orders are claimed or still being cooked in partner kitchens.' }}
            </p>
            <button (click)="resetFilters()" 
                    class="px-5 py-2.5 bg-gold hover:bg-gold-light text-black font-extrabold text-xs uppercase tracking-wider rounded transition-all cursor-pointer shadow-md inline-flex items-center gap-2">
              <i class="fa-solid fa-arrows-rotate"></i> Reset Filters
            </button>
          </div>

          <!-- Requests Grid (Customer / Restaurant Card Style) -->
          <div *ngIf="filteredRequests.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div *ngFor="let ord of filteredRequests" 
                 class="bg-[#141414] border border-[#242424] hover:border-gold/60 rounded p-6 flex flex-col justify-between gap-4 transition-all shadow-xl group">
              <div>
                <!-- Header Strip -->
                <div class="flex justify-between items-center pb-3 border-b border-[#242424] mb-3">
                  <div>
                    <span class="font-extrabold text-white text-sm mr-2 font-mono">#{{ ord.orderNumber }}</span>
                    <span class="text-xs text-neutral-500">{{ ord.createdAt | date:'shortTime' }}</span>
                  </div>
                  <span class="text-[10px] font-bold px-2.5 py-0.5 rounded uppercase bg-gold/20 text-gold border border-gold/40">
                    Ready For Pickup
                  </span>
                </div>

                <!-- Courier Payout Highlight Strip -->
                <div class="p-3 bg-[#0d0d0d] border border-[#202020] rounded mb-3 flex items-center justify-between">
                  <span class="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Guaranteed Payout</span>
                  <span class="text-sm font-extrabold text-emerald-400 font-serif">
                    +&#36;{{ earnings?.ratePerDelivery || 4.50 | number:'1.2-2' }}
                  </span>
                </div>

                <!-- Route Details -->
                <div class="space-y-3 mb-3 text-xs">
                  <!-- Pickup Point -->
                  <div class="flex items-start gap-2.5">
                    <div class="w-6 h-6 rounded bg-[#1e1910] border border-gold/30 flex items-center justify-center shrink-0 text-gold text-[10px] mt-0.5">
                      <i class="fa-solid fa-store"></i>
                    </div>
                    <div class="min-w-0">
                      <strong class="text-white block text-sm truncate">{{ ord.restaurant?.name || 'Restaurant' }}</strong>
                      <p class="text-neutral-400 text-[11px] leading-snug">{{ ord.restaurant?.address || 'Kitchen address' }}</p>
                    </div>
                  </div>

                  <!-- Dropoff Point -->
                  <div class="flex items-start gap-2.5">
                    <div class="w-6 h-6 rounded bg-rose-950/40 border border-rose-500/30 flex items-center justify-center shrink-0 text-rose-400 text-[10px] mt-0.5">
                      <i class="fa-solid fa-location-dot"></i>
                    </div>
                    <div class="min-w-0">
                      <strong class="text-white block text-sm">{{ ord.customer?.fullName || 'Customer' }}</strong>
                      <p class="text-neutral-400 text-[11px]">{{ ord.deliveryAddressText }}</p>
                      <p *ngIf="ord.customer?.phone" class="text-neutral-500 text-[10px] mt-0.5">{{ ord.customer?.phone }}</p>
                    </div>
                  </div>

                  <!-- Customer Note if present -->
                  <div *ngIf="ord.customerNotes" class="bg-gold/10 border border-gold/30 rounded p-2 text-gold text-[11px]">
                    <i class="fa-solid fa-note-sticky mr-1"></i> Special Note: {{ ord.customerNotes }}
                  </div>
                </div>
              </div>

              <!-- Claim Button -->
              <button (click)="claimOrder(ord.id)" 
                      [disabled]="claimingId === ord.id"
                      class="w-full py-2.5 bg-gold hover:bg-gold-light text-black font-extrabold text-xs uppercase tracking-wider rounded transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 disabled:opacity-50">
                <i class="fa-solid" [ngClass]="claimingId === ord.id ? 'fa-spinner fa-spin' : 'fa-hand-holding-hand'"></i>
                <span>{{ claimingId === ord.id ? 'Claiming Ticket...' : 'Claim This Delivery' }}</span>
              </button>
            </div>
          </div>

        </div>

        <!-- ======================================================== -->
        <!-- VIEW 2: ACTIVE VIEW -->
        <!-- ======================================================== -->
        <div *ngIf="!loading && (currentTab === 'ACTIVE' || currentTab === 'ALL')" class="mb-12">
          
          <div class="flex items-center justify-between pb-3 mb-6 border-b border-[#242424]">
            <div class="flex items-center gap-3">
              <span class="text-xs font-bold uppercase tracking-[2px] text-gold block">
                MY ACTIVE DELIVERIES
              </span>
              <span class="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                {{ filteredActiveTasks.length }} In Progress
              </span>
            </div>
            <span *ngIf="currentTab === 'ALL'" (click)="currentTab = 'ACTIVE'" class="text-xs font-bold text-emerald-400 hover:underline cursor-pointer flex items-center gap-1.5">
              <span>Focus Active</span>
              <i class="fa-solid fa-arrow-right text-[10px]"></i>
            </span>
          </div>

          <!-- Empty State (Matching Restaurant Empty State) -->
          <div *ngIf="filteredActiveTasks.length === 0" 
               class="bg-[#141414] border border-[#242424] rounded p-16 text-center text-neutral-500 text-xs shadow-xl mb-6">
            <div class="w-16 h-16 rounded bg-[#1b1b1b] border border-[#282828] mx-auto flex items-center justify-center text-gold/80 text-2xl mb-4">
              <i class="fa-solid fa-motorcycle"></i>
            </div>
            <p class="font-bold text-white text-base">No active deliveries in progress</p>
            <p class="text-xs text-neutral-400 mt-1 mb-4">
              {{ searchQuery ? 'No active orders match your search query.' : 'You have no orders currently in transit. Claim ready kitchen orders to start delivery.' }}
            </p>
            <button (click)="currentTab = 'REQUESTS'" 
                    class="px-5 py-2.5 bg-gold hover:bg-gold-light text-black font-extrabold text-xs uppercase tracking-wider rounded transition-all cursor-pointer shadow-md inline-flex items-center gap-2">
              <i class="fa-solid fa-boxes-packing"></i> Browse Available Requests
            </button>
          </div>

          <!-- Active Cards List -->
          <div *ngIf="filteredActiveTasks.length > 0" class="space-y-6">
            <div *ngFor="let task of filteredActiveTasks" 
                 class="bg-[#141414] border border-gold/40 rounded p-6 sm:p-8 shadow-2xl">
              
              <!-- Task Top Bar -->
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#242424] mb-6">
                <div>
                  <div class="flex items-center gap-3">
                    <span class="font-extrabold text-white text-base font-mono">#{{ task.order.orderNumber }}</span>
                    <span class="text-[10px] font-bold px-2.5 py-0.5 rounded uppercase border"
                          [ngClass]="{
                            'bg-amber-950/40 border-amber-500/40 text-amber-400': task.status === 'ACCEPTED',
                            'bg-blue-950/40 border-blue-500/40 text-blue-400': task.status === 'PICKED_UP',
                            'bg-purple-950/40 border-purple-500/40 text-purple-400': task.status === 'ON_THE_WAY'
                          }">
                      {{ task.status.replace('_', ' ') }}
                    </span>
                  </div>
                  <p class="text-xs text-neutral-400 mt-1">
                    Claimed {{ task.acceptedAt | date:'mediumTime' }} &bull; Assigned to you
                  </p>
                </div>

                <div class="sm:text-right">
                  <span class="text-xl font-extrabold text-emerald-400 font-serif block">
                    +&#36;{{ earnings?.ratePerDelivery || 4.50 | number:'1.2-2' }}
                  </span>
                  <span class="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">Guaranteed Payout</span>
                </div>
              </div>

              <!-- Lifecycle Stepper Progression Bar -->
              <div class="mb-6 p-4 rounded bg-[#0d0d0d] border border-[#242424]">
                <span class="text-[10px] uppercase font-bold tracking-[2px] text-neutral-400 block mb-3">
                  DELIVERY LIFECYCLE PROGRESS
                </span>
                <div class="grid grid-cols-3 gap-3 text-center">
                  <div class="p-3 rounded border transition-all"
                       [ngClass]="task.status === 'ACCEPTED' || task.status === 'PICKED_UP' || task.status === 'ON_THE_WAY' ? 'bg-[#18150d] border-gold/60 text-gold' : 'bg-[#141414] border-[#222] text-neutral-500'">
                    <i class="fa-solid fa-check-circle text-xs mb-1 block"></i>
                    <span class="text-xs font-bold block">1. Claimed</span>
                    <span class="text-[10px] text-neutral-400">At Kitchen</span>
                  </div>

                  <div class="p-3 rounded border transition-all"
                       [ngClass]="task.status === 'PICKED_UP' || task.status === 'ON_THE_WAY' ? 'bg-[#18150d] border-gold/60 text-gold' : 'bg-[#141414] border-[#222] text-neutral-500'">
                    <i class="fa-solid fa-bag-shopping text-xs mb-1 block"></i>
                    <span class="text-xs font-bold block">2. Picked Up</span>
                    <span class="text-[10px] text-neutral-400">Order secured</span>
                  </div>

                  <div class="p-3 rounded border transition-all"
                       [ngClass]="task.status === 'ON_THE_WAY' ? 'bg-[#18150d] border-gold/60 text-gold' : 'bg-[#141414] border-[#222] text-neutral-500'">
                    <i class="fa-solid fa-motorcycle text-xs mb-1 block"></i>
                    <span class="text-xs font-bold block">3. In Transit</span>
                    <span class="text-[10px] text-neutral-400">En route</span>
                  </div>
                </div>
              </div>

              <!-- Route Details (2 Columns) -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <!-- Kitchen Pickup -->
                <div class="p-4 rounded bg-[#0d0d0d] border border-[#202020]">
                  <div class="flex items-center gap-2 text-gold font-bold text-xs uppercase tracking-wider mb-2">
                    <i class="fa-solid fa-store text-xs"></i>
                    <span>Restaurant Pickup</span>
                  </div>
                  <h4 class="text-sm font-bold text-white">{{ task.order.restaurant?.name || 'Restaurant' }}</h4>
                  <p class="text-xs text-neutral-400 mt-1">{{ task.order.restaurant?.address || 'Pickup address' }}</p>
                  <div class="mt-3 pt-2.5 border-t border-[#1c1c1c] flex items-center justify-between text-xs">
                    <span class="text-neutral-400">Kitchen Phone:</span>
                    <a [href]="'tel:' + (task.order.restaurant?.phone || '')" class="text-white hover:text-gold font-bold">
                      <i class="fa-solid fa-phone text-[10px] mr-1"></i> {{ task.order.restaurant?.phone || 'On File' }}
                    </a>
                  </div>
                </div>

                <!-- Customer Destination -->
                <div class="p-4 rounded bg-[#0d0d0d] border border-[#202020]">
                  <div class="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider mb-2">
                    <i class="fa-solid fa-location-dot text-xs"></i>
                    <span>Customer Destination</span>
                  </div>
                  <h4 class="text-sm font-bold text-white">{{ task.order.customer?.fullName || 'Customer' }}</h4>
                  <p class="text-xs text-neutral-400 mt-1">{{ task.order.deliveryAddressText }}</p>
                  <div class="mt-3 pt-2.5 border-t border-[#1c1c1c] flex items-center justify-between text-xs">
                    <span class="text-neutral-400">Customer Phone:</span>
                    <a [href]="'tel:' + (task.order.customer?.phone || '')" class="text-white hover:text-gold font-bold">
                      <i class="fa-solid fa-phone text-[10px] mr-1"></i> {{ task.order.customer?.phone || 'On File' }}
                    </a>
                  </div>
                </div>
              </div>

              <!-- Customer Special Notes -->
              <div *ngIf="task.order.customerNotes" class="bg-gold/10 border border-gold/30 rounded p-3 text-gold text-xs mb-6">
                <i class="fa-solid fa-note-sticky mr-1.5"></i> Special Note: {{ task.order.customerNotes }}
              </div>

              <!-- Lifecycle Progression Actions (Matching Restaurant Buttons) -->
              <div class="flex flex-wrap items-center justify-end gap-3 pt-5 border-t border-[#242424]">
                <ng-container *ngIf="task.status === 'ACCEPTED'">
                  <button (click)="updateStatus(task.id, 'PICKED_UP')" 
                          [disabled]="updatingTaskId === task.id"
                          class="px-5 py-2.5 bg-gold hover:bg-gold-light text-black font-extrabold text-xs uppercase tracking-wider rounded transition-all cursor-pointer shadow-md inline-flex items-center gap-2">
                    <i class="fa-solid" [ngClass]="updatingTaskId === task.id ? 'fa-spinner fa-spin' : 'fa-bag-shopping'"></i>
                    <span>Confirm Order Picked Up</span>
                  </button>
                </ng-container>

                <ng-container *ngIf="task.status === 'PICKED_UP'">
                  <button (click)="updateStatus(task.id, 'ON_THE_WAY')" 
                          [disabled]="updatingTaskId === task.id"
                          class="px-5 py-2.5 bg-gold hover:bg-gold-light text-black font-extrabold text-xs uppercase tracking-wider rounded transition-all cursor-pointer shadow-md inline-flex items-center gap-2">
                    <i class="fa-solid" [ngClass]="updatingTaskId === task.id ? 'fa-spinner fa-spin' : 'fa-motorcycle'"></i>
                    <span>Depart (Out for Delivery)</span>
                  </button>
                </ng-container>

                <ng-container *ngIf="task.status === 'ON_THE_WAY'">
                  <button (click)="updateStatus(task.id, 'DELIVERED')" 
                          [disabled]="updatingTaskId === task.id"
                          class="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider rounded transition-all cursor-pointer shadow-md inline-flex items-center gap-2">
                    <i class="fa-solid" [ngClass]="updatingTaskId === task.id ? 'fa-spinner fa-spin' : 'fa-circle-check'"></i>
                    <span>Complete Delivery (Delivered)</span>
                  </button>
                </ng-container>
              </div>

            </div>
          </div>

        </div>

        <!-- ======================================================== -->
        <!-- VIEW 3: HISTORY VIEW -->
        <!-- ======================================================== -->
        <div *ngIf="!loading && (currentTab === 'HISTORY' || currentTab === 'ALL')" class="mb-12">
          
          <div class="flex items-center justify-between pb-3 mb-6 border-b border-[#242424]">
            <div class="flex items-center gap-3">
              <span class="text-xs font-bold uppercase tracking-[2px] text-gold block">
                DELIVERY FULFILLMENT ARCHIVE
              </span>
              <span class="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                {{ filteredHistoryTasks.length }} Fulfilled
              </span>
            </div>
            <span *ngIf="currentTab === 'ALL'" (click)="currentTab = 'HISTORY'" class="text-xs font-bold text-gold hover:underline cursor-pointer flex items-center gap-1.5">
              <span>Focus History</span>
              <i class="fa-solid fa-arrow-right text-[10px]"></i>
            </span>
          </div>

          <!-- Empty State (Matching Restaurant Empty State) -->
          <div *ngIf="filteredHistoryTasks.length === 0" 
               class="bg-[#141414] border border-[#242424] rounded p-16 text-center text-neutral-500 text-xs shadow-xl mb-6">
            <div class="w-16 h-16 rounded bg-[#1b1b1b] border border-[#282828] mx-auto flex items-center justify-center text-gold/80 text-2xl mb-4">
              <i class="fa-solid fa-receipt"></i>
            </div>
            <p class="font-bold text-white text-base">No completed deliveries found</p>
            <p class="text-xs text-neutral-400 mt-1 mb-4">
              {{ searchQuery ? 'No past deliveries match your search query.' : 'Once you complete your active deliveries, they will appear here in the archive.' }}
            </p>
            <button (click)="resetFilters()" 
                    class="px-5 py-2.5 bg-gold hover:bg-gold-light text-black font-extrabold text-xs uppercase tracking-wider rounded transition-all cursor-pointer shadow-md inline-flex items-center gap-2">
              <i class="fa-solid fa-arrows-rotate"></i> Reset Filters
            </button>
          </div>

          <!-- History Table Card -->
          <div *ngIf="filteredHistoryTasks.length > 0" 
               class="bg-[#141414] border border-[#242424] rounded shadow-xl overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="border-b border-[#242424] text-neutral-400 font-bold uppercase tracking-wider bg-[#0f0f0f]">
                    <th class="p-4 sm:p-5">Order #</th>
                    <th class="p-4 sm:p-5">Restaurant</th>
                    <th class="p-4 sm:p-5">Customer & Destination</th>
                    <th class="p-4 sm:p-5">Fulfilled Time</th>
                    <th class="p-4 sm:p-5 text-right">Earned Payout</th>
                    <th class="p-4 sm:p-5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[#1e1e1e]">
                  <tr *ngFor="let task of filteredHistoryTasks" class="hover:bg-[#181818] transition-colors">
                    <td class="p-4 sm:p-5 font-mono font-bold text-white">
                      #{{ task.order.orderNumber }}
                    </td>
                    <td class="p-4 sm:p-5">
                      <strong class="text-white block">{{ task.order.restaurant?.name || 'Restaurant' }}</strong>
                      <span class="text-neutral-500 text-[11px]">{{ task.order.restaurant?.address || 'Kitchen' }}</span>
                    </td>
                    <td class="p-4 sm:p-5">
                      <strong class="text-white block">{{ task.order.customer?.fullName || 'Customer' }}</strong>
                      <span class="text-neutral-400 text-[11px]">{{ task.order.deliveryAddressText }}</span>
                    </td>
                    <td class="p-4 sm:p-5 text-neutral-400 text-[11px]">
                      {{ (task.deliveredAt || task.acceptedAt || task.assignedAt) | date:'MMM d, y, h:mm a' }}
                    </td>
                    <td class="p-4 sm:p-5 text-right font-serif font-extrabold text-emerald-400 text-sm">
                      +&#36;{{ earnings?.ratePerDelivery || 4.50 | number:'1.2-2' }}
                    </td>
                    <td class="p-4 sm:p-5 text-center">
                      <span class="px-2.5 py-1 rounded text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                        DELIVERED
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </div>
  `
})
export class DeliveryOrdersComponent implements OnInit {
  currentTab: DeliveryTab = 'ALL';
  private initialTabResolved: boolean = false;

  availableOrders: Order[] = [];
  activeTasks: DeliveryAssignment[] = [];
  completedTasks: DeliveryAssignment[] = [];
  earnings: EarningsSummary | null = null;

  loading: boolean = false;
  claimingId: number | null = null;
  updatingTaskId: number | null = null;
  feedbackMessage: string = '';

  // Sub-filters & Search
  searchQuery: string = '';
  selectedZoneFilter: string = 'ALL';
  selectedActiveStatusFilter: string = 'ALL';
  selectedHistoryTimeFilter: string = 'ALL';

  constructor(
    private deliveryService: DeliveryService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadAllData();
  }

  onTabChange(): void {
    // CurrentTab is bound with [(ngModel)]
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedZoneFilter = 'ALL';
    this.selectedActiveStatusFilter = 'ALL';
    this.selectedHistoryTimeFilter = 'ALL';
    this.loadAllData();
  }

  get totalOrdersCount(): number {
    return this.availableOrders.length + this.activeTasks.length + this.completedTasks.length;
  }

  get currentFilteredCount(): number {
    if (this.currentTab === 'REQUESTS') return this.filteredRequests.length;
    if (this.currentTab === 'ACTIVE') return this.filteredActiveTasks.length;
    if (this.currentTab === 'HISTORY') return this.filteredHistoryTasks.length;
    return this.filteredRequests.length + this.filteredActiveTasks.length + this.filteredHistoryTasks.length;
  }

  get currentTotalCount(): number {
    if (this.currentTab === 'REQUESTS') return this.availableOrders.length;
    if (this.currentTab === 'ACTIVE') return this.activeTasks.length;
    if (this.currentTab === 'HISTORY') return this.completedTasks.length;
    return this.totalOrdersCount;
  }

  loadAllData(): void {
    this.loading = true;

    // Load available orders (requests)
    this.deliveryService.getAvailableOrders().subscribe({
      next: res => {
        if (res.success && res.data) {
          this.availableOrders = res.data;
          if (!this.initialTabResolved) {
            if (this.activeTasks.length === 0 && this.availableOrders.length > 0) {
              this.currentTab = 'REQUESTS';
            }
          }
        }
      }
    });

    // Load active and completed tasks
    this.deliveryService.getTasks().subscribe({
      next: res => {
        this.loading = false;
        if (res.success && res.data) {
          this.activeTasks = res.data.filter(t => t.status !== 'DELIVERED' && t.status !== 'DECLINED');
          this.completedTasks = res.data.filter(t => t.status === 'DELIVERED');

          if (!this.initialTabResolved) {
            this.initialTabResolved = true;
            if (this.activeTasks.length > 0) {
              this.currentTab = 'ACTIVE';
            } else if (this.availableOrders.length > 0) {
              this.currentTab = 'REQUESTS';
            } else {
              this.currentTab = 'ALL';
            }
          }
        }
      },
      error: () => {
        this.loading = false;
      }
    });

    // Load earnings
    this.deliveryService.getEarnings().subscribe({
      next: res => {
        if (res.success && res.data) {
          this.earnings = res.data;
        }
      }
    });
  }

  // Filtered Requests
  get filteredRequests(): Order[] {
    let list = this.availableOrders;
    if (this.selectedZoneFilter !== 'ALL') {
      const z = this.selectedZoneFilter.toLowerCase();
      if (z === 'downtown') {
        list = list.filter(o => (o.deliveryAddressText?.toLowerCase().includes('soho') || o.deliveryAddressText?.toLowerCase().includes('downtown') || o.deliveryAddressText?.toLowerCase().includes('mercer')));
      } else if (z === 'midtown') {
        list = list.filter(o => (o.deliveryAddressText?.toLowerCase().includes('midtown') || o.deliveryAddressText?.toLowerCase().includes('chelsea') || o.deliveryAddressText?.toLowerCase().includes('broadway')));
      } else if (z === 'east_side') {
        list = list.filter(o => (o.deliveryAddressText?.toLowerCase().includes('east') || o.deliveryAddressText?.toLowerCase().includes('village') || o.deliveryAddressText?.toLowerCase().includes('ave')));
      }
    }

    if (!this.searchQuery) return list;
    const q = this.searchQuery.toLowerCase();
    return list.filter(o =>
      o.orderNumber.toLowerCase().includes(q) ||
      o.restaurant?.name?.toLowerCase().includes(q) ||
      o.deliveryAddressText?.toLowerCase().includes(q) ||
      o.customer?.fullName?.toLowerCase().includes(q)
    );
  }

  // Filtered Active Tasks
  get filteredActiveTasks(): DeliveryAssignment[] {
    let list = this.activeTasks;
    if (this.selectedActiveStatusFilter !== 'ALL') {
      list = list.filter(t => t.status === this.selectedActiveStatusFilter);
    }

    if (!this.searchQuery) return list;
    const q = this.searchQuery.toLowerCase();
    return list.filter(t =>
      t.order.orderNumber.toLowerCase().includes(q) ||
      t.order.restaurant?.name?.toLowerCase().includes(q) ||
      t.order.customer?.fullName?.toLowerCase().includes(q) ||
      t.order.deliveryAddressText?.toLowerCase().includes(q)
    );
  }

  // Filtered History Tasks
  get filteredHistoryTasks(): DeliveryAssignment[] {
    let list = this.completedTasks;
    if (this.selectedHistoryTimeFilter === 'TODAY') {
      const today = new Date().toDateString();
      list = list.filter(t => new Date(t.deliveredAt || t.acceptedAt || '').toDateString() === today);
    } else if (this.selectedHistoryTimeFilter === 'THIS_WEEK') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      list = list.filter(t => new Date(t.deliveredAt || t.acceptedAt || '') >= weekAgo);
    }

    if (!this.searchQuery) return list;
    const q = this.searchQuery.toLowerCase();
    return list.filter(t =>
      t.order.orderNumber.toLowerCase().includes(q) ||
      t.order.restaurant?.name?.toLowerCase().includes(q) ||
      t.order.customer?.fullName?.toLowerCase().includes(q) ||
      t.order.deliveryAddressText?.toLowerCase().includes(q)
    );
  }

  // Claim Order Action
  claimOrder(orderId: number): void {
    this.claimingId = orderId;
    this.deliveryService.claimTask(orderId).subscribe({
      next: () => {
        this.claimingId = null;
        this.feedbackMessage = `Delivery assignment claimed successfully! View your active route below.`;
        this.loadAllData();
        this.currentTab = 'ACTIVE';
      },
      error: () => {
        this.claimingId = null;
      }
    });
  }

  // Milestone Progression
  updateStatus(taskId: number, newStatus: string): void {
    this.updatingTaskId = taskId;
    this.deliveryService.updateStep(taskId, newStatus).subscribe({
      next: () => {
        this.updatingTaskId = null;
        if (newStatus === 'DELIVERED') {
          this.feedbackMessage = `Order marked as successfully fulfilled! Payout logged to earnings.`;
        } else {
          this.feedbackMessage = `Delivery milestone updated to ${newStatus.replace('_', ' ')}.`;
        }
        this.loadAllData();
      },
      error: () => {
        this.updatingTaskId = null;
      }
    });
  }
}

// Export both names for backwards compatibility
export { DeliveryOrdersComponent as OrdersComponent };
