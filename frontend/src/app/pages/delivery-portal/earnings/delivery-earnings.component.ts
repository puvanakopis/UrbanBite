import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DeliveryService } from '../../../services/delivery.service';
import { DeliveryAssignment, EarningsSummary } from '../../../models/delivery.models';

@Component({
  selector: 'app-delivery-earnings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="bg-[#090909] min-h-[90vh] py-12 sm:py-16 text-neutral-200">
      <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Loading State (Matching Restaurant Loading State) -->
        <div *ngIf="loading" class="bg-[#141414] border border-[#242424] rounded p-20 text-center mb-8">
          <div class="w-10 h-10 border-2 border-neutral-700 border-t-gold rounded-full animate-spin mx-auto mb-4"></div>
          <h3 class="text-base font-bold text-white mb-1">Loading Financial Ledger</h3>
          <p class="text-xs text-neutral-400">Retrieving courier delivery compensation, automated bank transfers, and payout records...</p>
        </div>

        <ng-container *ngIf="!loading">
          <!-- Customer-Style Page Header (Matching Restaurant Orders) -->
          <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-4 border-b border-[#242424]">
            <div>
              <span class="text-xs font-bold uppercase tracking-[2.5px] text-gold mb-2 block">
                FINANCIAL OPERATIONS & LEDGER
              </span>
              <div class="flex items-center gap-3">
                <h1 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Earnings & Payouts
                </h1>
              </div>
            </div>

            <!-- Header Actions (Matching Restaurant Header Actions) -->
            <div class="flex items-center gap-3">
              <button 
                (click)="loadEarnings()" 
                class="px-4 py-2 border border-neutral-700 hover:border-white text-neutral-300 hover:text-white rounded text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2">
                <i class="fa-solid fa-arrows-rotate" [ngClass]="{'fa-spin': loading}"></i>
                <span>Refresh</span>
              </button>

              <button 
                (click)="requestPayout()"
                [disabled]="payoutRequested"
                class="px-5 py-2.5 bg-gold hover:bg-gold-light text-black font-extrabold text-xs uppercase tracking-wider rounded transition-all cursor-pointer shadow-md flex items-center gap-2 disabled:opacity-50">
                <i class="fa-solid fa-money-bill-transfer"></i>
                <span>{{ payoutRequested ? 'Transfer Initiated' : 'Instant Cash Out' }}</span>
              </button>
            </div>
          </div>

          <!-- Success Alert if payout requested (Matching Restaurant Settings Success Alert) -->
          <div *ngIf="payoutRequested" class="mb-6 p-4 bg-emerald-950/60 border border-emerald-500/40 rounded text-emerald-400 text-xs flex items-center gap-2.5 animate-fadeIn">
            <i class="fa-solid fa-circle-check text-sm"></i>
            <span class="font-bold">Instant payout of &#36;{{ (earnings?.totalEarnings || 0) | number:'1.2-2' }} initiated to JPMorgan Chase Checking (ending in 8842). Deposit estimated in 15-30 minutes.</span>
          </div>

          <!-- Primary Metric Cards Strip (Matching Restaurant Dashboard) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <div class="bg-[#141414] border border-[#242424] rounded p-6 shadow-xl flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
              <div class="flex justify-between items-start mb-3">
                <span class="text-[11px] font-bold tracking-wider text-neutral-400 uppercase">LIFETIME REVENUE</span>
                <i class="fa-solid fa-wallet text-xs text-emerald-400"></i>
              </div>
              <span class="text-3xl font-extrabold text-emerald-400 font-serif mb-1">
                &#36;{{ (earnings?.totalEarnings || 0) | number:'1.2-2' }}
              </span>
              <span class="text-xs text-neutral-500">100% courier retention</span>
            </div>

            <div class="bg-[#141414] border border-[#242424] rounded p-6 shadow-xl flex flex-col justify-between hover:border-gold/40 transition-colors">
              <div class="flex justify-between items-start mb-3">
                <span class="text-[11px] font-bold tracking-wider text-neutral-400 uppercase">AVAILABLE CASHOUT</span>
                <i class="fa-solid fa-vault text-xs text-gold"></i>
              </div>
              <span class="text-3xl font-extrabold text-white font-serif mb-1">
                &#36;{{ (earnings?.totalEarnings || 0) | number:'1.2-2' }}
              </span>
              <span class="text-xs text-neutral-500">Ready for instant transfer</span>
            </div>

            <div class="bg-[#141414] border border-[#242424] rounded p-6 shadow-xl flex flex-col justify-between hover:border-neutral-700 transition-colors">
              <div class="flex justify-between items-start mb-3">
                <span class="text-[11px] font-bold tracking-wider text-neutral-400 uppercase">BASE RATE PER TRIP</span>
                <i class="fa-solid fa-coins text-xs text-neutral-500"></i>
              </div>
              <span class="text-3xl font-extrabold text-white font-serif mb-1">
                &#36;{{ (earnings?.ratePerDelivery || 4.50) | number:'1.2-2' }}
              </span>
              <span class="text-xs text-neutral-500">Fixed rate per fulfillment</span>
            </div>

            <div class="bg-[#141414] border border-[#242424] rounded p-6 shadow-xl flex flex-col justify-between hover:border-neutral-700 transition-colors">
              <div class="flex justify-between items-start mb-3">
                <span class="text-[11px] font-bold tracking-wider text-neutral-400 uppercase">FULFILLED ORDERS</span>
                <i class="fa-solid fa-circle-check text-xs text-neutral-500"></i>
              </div>
              <span class="text-3xl font-extrabold text-white font-serif mb-1">
                {{ completedTasks.length }}
              </span>
              <span class="text-xs text-neutral-500">Settled deliveries</span>
            </div>
          </div>

          <!-- Main 2-Column Grid (Ledger + Banking Details) -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 items-start">
            
            <!-- Column 1 & 2: Completed Orders Ledger Table (2 cols) -->
            <div class="lg:col-span-2 space-y-6">
              
              <!-- Filter & Search Toolbar (Customer & Restaurant Style) -->
              <div class="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
                <div class="flex items-center gap-3">
                  <div class="relative min-w-[200px] sm:w-56">
                    <div class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold text-xs pointer-events-none">
                      <i class="fa-solid fa-filter"></i>
                    </div>
                    <select 
                      [(ngModel)]="selectedTimeFilter" 
                      class="w-full pl-9 pr-9 py-2 bg-[#141414] border border-[#242424] rounded text-xs text-white focus:outline-none focus:border-gold transition-colors appearance-none cursor-pointer font-bold tracking-wider uppercase">
                      <option value="ALL" class="bg-[#141414] text-white">All Settlements ({{ completedTasks.length }})</option>
                      <option value="TODAY" class="bg-[#141414] text-white">Fulfilled Today</option>
                      <option value="THIS_WEEK" class="bg-[#141414] text-white">Past 7 Days</option>
                    </select>
                    <div class="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-[10px] pointer-events-none">
                      <i class="fa-solid fa-chevron-down"></i>
                    </div>
                  </div>

                  <span class="hidden sm:inline-flex items-center px-2.5 py-1.5 text-[11px] font-bold text-neutral-400 bg-[#141414] border border-[#242424] rounded">
                    Showing {{ filteredTasks.length }} of {{ completedTasks.length }}
                  </span>
                </div>

                <!-- Search Bar -->
                <div class="relative min-w-[220px] sm:w-64">
                  <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 text-xs"></i>
                  <input 
                    type="text" 
                    [(ngModel)]="searchQuery" 
                    placeholder="Search ledger by #order..." 
                    class="w-full pl-9 pr-8 py-2 bg-[#141414] border border-[#242424] rounded text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-gold transition-colors" />
                  <button *ngIf="searchQuery" 
                          (click)="searchQuery = ''" 
                          class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white text-xs">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>

              <!-- Table Card Container -->
              <div class="bg-[#141414] border border-[#242424] rounded shadow-xl overflow-hidden">
                <div class="p-6 border-b border-[#242424] flex items-center justify-between">
                  <div>
                    <span class="text-[10px] font-extrabold uppercase tracking-[2px] text-gold block mb-1">TRANSACTION BREAKDOWN</span>
                    <h3 class="text-base font-bold text-white">Recent Earnings Ledger</h3>
                  </div>
                  <span class="text-xs text-neutral-400 font-mono font-bold">
                    {{ filteredTasks.length }} Settled Logs
                  </span>
                </div>

                <!-- Empty State (Matching Restaurant Empty State) -->
                <div *ngIf="filteredTasks.length === 0" class="p-16 text-center text-neutral-500 text-xs">
                  <div class="w-16 h-16 rounded bg-[#1b1b1b] border border-[#282828] mx-auto flex items-center justify-center text-gold/80 text-2xl mb-4">
                    <i class="fa-solid fa-receipt"></i>
                  </div>
                  <p class="font-bold text-white text-base">No transaction ledger entries found</p>
                  <p class="text-xs text-neutral-400 mt-1 mb-4">
                    {{ searchQuery ? 'No settlements match your search query.' : 'Complete delivery dispatches to record earnings here.' }}
                  </p>
                  <a routerLink="/delivery-portal/orders" 
                     class="px-5 py-2.5 bg-gold hover:bg-gold-light text-black font-extrabold text-xs uppercase tracking-wider rounded transition-all cursor-pointer shadow-md inline-flex items-center gap-2">
                    <i class="fa-solid fa-boxes-packing"></i> Browse Available Requests
                  </a>
                </div>

                <div *ngIf="filteredTasks.length > 0" class="overflow-x-auto">
                  <table class="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr class="border-b border-[#242424] text-neutral-400 font-bold uppercase tracking-wider bg-[#0f0f0f]">
                        <th class="p-4 sm:p-5">Order #</th>
                        <th class="p-4 sm:p-5">Restaurant</th>
                        <th class="p-4 sm:p-5">Fulfilled Time</th>
                        <th class="p-4 sm:p-5">Base Fee</th>
                        <th class="p-4 sm:p-5 text-right">Net Payout</th>
                        <th class="p-4 sm:p-5 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-[#1e1e1e]">
                      <tr *ngFor="let task of filteredTasks" class="hover:bg-[#181818] transition-colors">
                        <td class="p-4 sm:p-5 font-mono font-bold text-white">#{{ task.order.orderNumber }}</td>
                        <td class="p-4 sm:p-5 text-white font-semibold">{{ task.order.restaurant?.name || 'Restaurant' }}</td>
                        <td class="p-4 sm:p-5 text-neutral-400 text-[11px]">{{ (task.deliveredAt || task.acceptedAt || task.assignedAt) | date:'MMM d, y, h:mm a' }}</td>
                        <td class="p-4 sm:p-5 text-neutral-300">&#36;{{ earnings?.ratePerDelivery || 4.50 | number:'1.2-2' }}</td>
                        <td class="p-4 sm:p-5 text-right font-serif font-extrabold text-emerald-400 text-sm">
                          +&#36;{{ earnings?.ratePerDelivery || 4.50 | number:'1.2-2' }}
                        </td>
                        <td class="p-4 sm:p-5 text-center">
                          <span class="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                            SETTLED
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            <!-- Column 3: Banking & Cashout Well (1 col) -->
            <div class="space-y-6">
              
              <!-- Direct Cash Out Box -->
              <div class="bg-[#141414] border border-[#242424] rounded p-6 shadow-xl">
                <span class="text-[10px] font-extrabold uppercase tracking-[2px] text-gold block mb-2">INSTANT TRANSFER</span>
                <h3 class="text-base font-bold text-white mb-2">On-Demand Cash Out</h3>
                <p class="text-xs text-neutral-400 leading-relaxed mb-5">
                  Transfer earned fees immediately to your verified checking account with zero transaction deductions.
                </p>

                <div class="p-4 rounded bg-[#0d0d0d] border border-[#202020] mb-5">
                  <span class="text-[10px] uppercase font-bold text-neutral-500 block">Available For Immediate Deposit</span>
                  <span class="text-2xl font-extrabold text-white font-serif block mt-1">
                    &#36;{{ (earnings?.totalEarnings || 0) | number:'1.2-2' }}
                  </span>
                </div>

                <button (click)="requestPayout()" 
                        [disabled]="payoutRequested"
                        class="w-full py-3 px-4 bg-gold hover:bg-gold-light text-black font-extrabold text-xs uppercase tracking-wider rounded transition-all cursor-pointer shadow-md text-center disabled:opacity-50">
                  {{ payoutRequested ? 'Transfer Initiated' : 'Cash Out Now' }}
                </button>
              </div>

              <!-- Automated Schedule Card -->
              <div class="bg-[#141414] border border-[#242424] rounded p-6 shadow-xl">
                <span class="text-[10px] font-extrabold uppercase tracking-[2px] text-gold block mb-2">BANKING DETAILS</span>
                <h3 class="text-base font-bold text-white mb-3">Linked Payout Method</h3>
                
                <div class="space-y-3 text-xs">
                  <div class="p-3.5 rounded bg-[#0d0d0d] border border-[#202020]">
                    <div class="flex items-center gap-3 mb-2">
                      <i class="fa-solid fa-building-columns text-gold text-base"></i>
                      <div>
                        <strong class="text-white block">JPMorgan Chase Bank</strong>
                        <span class="text-neutral-400 text-[11px]">Checking &bull;&bull;&bull;&bull; 8842</span>
                      </div>
                    </div>
                    <span class="text-emerald-400 font-bold flex items-center gap-1.5 text-[11px]">
                      <i class="fa-solid fa-circle-check text-[10px]"></i> Verified Active Direct Deposit
                    </span>
                  </div>

                  <div class="p-3.5 rounded bg-[#0d0d0d] border border-[#202020] flex items-center justify-between">
                    <div>
                      <strong class="text-white block text-xs">Next Auto Settlement</strong>
                      <span class="text-neutral-400 text-[11px]">Weekly batch payout</span>
                    </div>
                    <span class="px-2 py-0.5 rounded bg-[#1e1e1e] text-neutral-200 font-mono font-bold text-[10px]">
                      Tuesday 12:00 AM
                    </span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </ng-container>

      </div>
    </div>
  `
})
export class DeliveryEarningsComponent implements OnInit {
  earnings: EarningsSummary | null = null;
  completedTasks: DeliveryAssignment[] = [];
  loading: boolean = false;
  payoutRequested: boolean = false;
  selectedTimeFilter: string = 'ALL';
  searchQuery: string = '';

  constructor(private deliveryService: DeliveryService) {}

  ngOnInit(): void {
    this.loadEarnings();
  }

  loadEarnings(): void {
    this.loading = true;
    this.deliveryService.getEarnings().subscribe({
      next: res => {
        this.loading = false;
        if (res.success && res.data) {
          this.earnings = res.data;
        }
      },
      error: () => this.loading = false
    });

    this.deliveryService.getTasks().subscribe({
      next: res => {
        if (res.success && res.data) {
          this.completedTasks = res.data.filter(t => t.status === 'DELIVERED');
        }
      }
    });
  }

  get filteredTasks(): DeliveryAssignment[] {
    let list = this.completedTasks;
    if (this.selectedTimeFilter === 'TODAY') {
      const today = new Date().toDateString();
      list = list.filter(t => new Date(t.deliveredAt || t.acceptedAt || '').toDateString() === today);
    } else if (this.selectedTimeFilter === 'THIS_WEEK') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      list = list.filter(t => new Date(t.deliveredAt || t.acceptedAt || '') >= weekAgo);
    }

    if (!this.searchQuery) return list;
    const q = this.searchQuery.toLowerCase();
    return list.filter(t => 
      t.order.orderNumber.toLowerCase().includes(q) ||
      t.order.restaurant?.name?.toLowerCase().includes(q)
    );
  }

  requestPayout(): void {
    this.payoutRequested = true;
    setTimeout(() => {
      this.payoutRequested = false;
    }, 6000);
  }
}
