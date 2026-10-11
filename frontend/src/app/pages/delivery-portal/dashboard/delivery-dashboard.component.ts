import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { DeliveryService } from '../../../services/delivery.service';
import { AuthService } from '../../../services/auth.service';
import { DeliveryAssignment, EarningsSummary } from '../../../models/delivery.models';
import { Order } from '../../../models/order.models';
import { User } from '../../../models/auth.models';

@Component({
  selector: 'app-delivery-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-[#090909] min-h-[90vh] py-12 sm:py-16 text-neutral-200">
      <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Loading State (Matching Restaurant Loading State) -->
        <div *ngIf="loading" class="bg-[#141414] border border-[#242424] rounded p-20 text-center mb-8">
          <div class="w-10 h-10 border-2 border-neutral-700 border-t-gold rounded-full animate-spin mx-auto mb-4"></div>
          <h3 class="text-base font-bold text-white mb-1">Loading Courier Operations Console</h3>
          <p class="text-xs text-neutral-400">Retrieving courier dispatch metrics, active routes, and ready kitchen tickets...</p>
        </div>

        <ng-container *ngIf="!loading">
          <!-- Customer-Style Page Header (Matching Restaurant Dashboard) -->
          <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-4 border-b border-[#242424]">
            <div>
              <span class="text-xs font-bold uppercase tracking-[2.5px] text-gold mb-2 block">
                COURIER FLEET & DISPATCH HUB
              </span>
              <div class="flex items-center gap-3">
                <h1 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {{ currentUser?.fullName || 'Courier Partner' }}
                </h1>
                <span class="px-2.5 py-1 text-[10px] font-bold tracking-wider rounded uppercase flex items-center gap-1.5"
                      [ngClass]="isOnline ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-400' : 'bg-rose-950/60 border border-rose-500/40 text-rose-400'">
                  <span class="inline-block w-1.5 h-1.5 rounded-full" [ngClass]="isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'"></span>
                  {{ isOnline ? 'Shift Active (Online)' : 'Shift Offline' }}
                </span>
              </div>
            </div>

            <!-- Header Actions (Matching Restaurant Header Actions) -->
            <div class="flex items-center gap-3">
              <button 
                (click)="toggleShiftStatus()" 
                class="px-4 py-2 border rounded font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2"
                [ngClass]="isOnline ? 'border-[#333] text-neutral-300 hover:border-white hover:bg-white/5' : 'bg-gold hover:bg-gold-light text-black border-gold'">
                <span class="w-2 h-2 rounded-full" [ngClass]="isOnline ? 'bg-emerald-400 shadow-[0_0_8px_#38b000]' : 'bg-rose-500'"></span>
                <span>{{ isOnline ? 'Go Offline' : 'Start Shift' }}</span>
              </button>

              <button 
                (click)="loadData()" 
                class="px-4 py-2 border border-neutral-700 hover:border-white text-neutral-300 hover:text-white rounded text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2">
                <i class="fa-solid fa-arrows-rotate" [ngClass]="{'fa-spin': loading}"></i>
                <span>Refresh</span>
              </button>

              <a 
                routerLink="/delivery-portal/orders" 
                class="px-5 py-2.5 bg-gold hover:bg-gold-light text-black font-extrabold text-xs uppercase tracking-wider rounded transition-all cursor-pointer shadow-md flex items-center gap-2">
                <i class="fa-solid fa-boxes-packing"></i>
                <span>Live Orders</span>
              </a>
            </div>
          </div>

          <!-- Attention Banner for Active / Ready Orders (Matching Restaurant Attention Banner) -->
          <div *ngIf="activeTasks.length > 0" class="mb-8 p-4 bg-gold/10 border border-gold/40 rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div class="flex items-center gap-3 text-gold">
              <div class="w-9 h-9 rounded bg-gold/20 flex items-center justify-center shrink-0">
                <i class="fa-solid fa-bell text-base animate-bounce"></i>
              </div>
              <div>
                <h4 class="font-bold text-sm text-white">Action Required: Ongoing Delivery In Transit</h4>
                <p class="text-xs text-neutral-300">Order #{{ activeTasks[0].order.orderNumber }} is en route to {{ activeTasks[0].order.deliveryAddressText }}. Update milestone upon arrival.</p>
              </div>
            </div>
            <a routerLink="/delivery-portal/orders" class="px-4 py-2 bg-gold hover:bg-gold-light text-black font-bold text-xs uppercase tracking-wider rounded transition-all whitespace-nowrap shadow">
              Continue Dispatch
            </a>
          </div>

          <!-- Metric Cards Strip (Matching Restaurant Metric Cards) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <div class="bg-[#141414] border border-[#242424] rounded p-6 shadow-xl flex flex-col justify-between hover:border-neutral-700 transition-colors">
              <div class="flex justify-between items-start mb-3">
                <span class="text-[11px] font-bold tracking-wider text-neutral-400 uppercase">ACTIVE DELIVERIES</span>
                <i class="fa-solid fa-motorcycle text-xs text-neutral-500"></i>
              </div>
              <span class="text-3xl font-extrabold text-white font-serif mb-1">{{ activeTasks.length }}</span>
              <span class="text-xs text-neutral-500">In transit or claimed</span>
            </div>

            <div class="bg-[#141414] border border-[#242424] rounded p-6 shadow-xl flex flex-col justify-between hover:border-gold/40 transition-colors">
              <div class="flex justify-between items-start mb-3">
                <span class="text-[11px] font-bold tracking-wider text-neutral-400 uppercase">READY FOR PICKUP</span>
                <i class="fa-solid fa-boxes-packing text-xs text-gold"></i>
              </div>
              <span class="text-3xl font-extrabold text-gold font-serif mb-1">{{ availableOrders.length }}</span>
              <span class="text-xs text-neutral-500">Available kitchen tickets</span>
            </div>

            <div class="bg-[#141414] border border-[#242424] rounded p-6 shadow-xl flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
              <div class="flex justify-between items-start mb-3">
                <span class="text-[11px] font-bold tracking-wider text-neutral-400 uppercase">GROSS EARNINGS</span>
                <i class="fa-solid fa-dollar-sign text-xs text-emerald-400"></i>
              </div>
              <span class="text-3xl font-extrabold text-emerald-400 font-serif mb-1">&#36;{{ (earnings?.totalEarnings || 0) | number:'1.2-2' }}</span>
              <span class="text-xs text-neutral-500">&#36;{{ (earnings?.ratePerDelivery || 4.50) | number:'1.2-2' }} per fulfillment</span>
            </div>

            <div class="bg-[#141414] border border-[#242424] rounded p-6 shadow-xl flex flex-col justify-between hover:border-neutral-700 transition-colors">
              <div class="flex justify-between items-start mb-3">
                <span class="text-[11px] font-bold tracking-wider text-neutral-400 uppercase">COMPLETED DELIVERIES</span>
                <i class="fa-solid fa-circle-check text-xs text-neutral-500"></i>
              </div>
              <span class="text-3xl font-extrabold text-white font-serif mb-1">{{ earnings?.completedDeliveries || 0 }}</span>
              <span class="text-xs text-neutral-500">Successful fulfillments</span>
            </div>
          </div>

          <!-- Main Content 2-Column Grid (Matching Restaurant Dashboard Grid) -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            
            <!-- Column 1 & 2: Live Dispatch Feed (2 cols) -->
            <div class="lg:col-span-2 space-y-8">
              
              <!-- Available Requests Box -->
              <div class="bg-[#141414] border border-[#242424] rounded p-6 sm:p-8 shadow-xl">
                <div class="flex justify-between items-center pb-5 border-b border-[#242424] mb-6">
                  <div>
                    <span class="text-[10px] font-extrabold uppercase tracking-[2px] text-gold block mb-1">AVAILABLE DISPATCH</span>
                    <h3 class="text-xl font-bold text-white flex items-center gap-2">
                      Ready For Courier Pickup
                    </h3>
                    <p class="text-xs text-neutral-400 mt-1">Claim packaged orders from restaurant counters in 1 click.</p>
                  </div>
                  <a routerLink="/delivery-portal/orders" class="text-xs font-bold text-gold hover:underline flex items-center gap-1.5">
                    <span>View All ({{ availableOrders.length }})</span>
                    <i class="fa-solid fa-arrow-right text-[10px]"></i>
                  </a>
                </div>

                <!-- Empty State (Matching Restaurant Orders Empty State) -->
                <div *ngIf="availableOrders.length === 0" 
                     class="p-12 text-center text-neutral-500 text-xs">
                  <div class="w-14 h-14 rounded bg-[#1b1b1b] border border-[#282828] mx-auto flex items-center justify-center text-gold/80 text-xl mb-3">
                    <i class="fa-solid fa-boxes-packing"></i>
                  </div>
                  <p class="font-bold text-white text-sm">No orders waiting for pickup</p>
                  <p class="text-xs text-neutral-400 mt-1 mb-4">All current customer orders are already claimed by dispatch or being prepared by partner kitchens.</p>
                  <button (click)="loadData()" 
                          class="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-extrabold text-xs uppercase tracking-wider rounded transition-all cursor-pointer shadow-md inline-flex items-center gap-2">
                    <i class="fa-solid fa-arrows-rotate"></i> Refresh Queue
                  </button>
                </div>

                <!-- Ready Orders Grid -->
                <div *ngIf="availableOrders.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div *ngFor="let ord of availableOrders.slice(0, 4)" 
                       class="bg-[#0d0d0d] border border-[#242424] hover:border-gold/50 rounded p-5 flex flex-col justify-between gap-4 transition-all group">
                    <div>
                      <div class="flex items-center justify-between pb-3 border-b border-[#202020] mb-3">
                        <span class="text-xs font-bold text-white font-mono">#{{ ord.orderNumber }}</span>
                        <span class="text-xs font-extrabold text-emerald-400 font-serif">
                          +&#36;{{ earnings?.ratePerDelivery || 4.50 | number:'1.2-2' }}
                        </span>
                      </div>

                      <div class="space-y-2 mb-3 text-xs">
                        <div class="flex items-start gap-2">
                          <i class="fa-solid fa-store text-gold text-[11px] mt-0.5"></i>
                          <div>
                            <strong class="text-white block">{{ ord.restaurant?.name || 'Restaurant' }}</strong>
                            <span class="text-neutral-400 text-[11px]">{{ ord.restaurant?.address || 'Pickup location' }}</span>
                          </div>
                        </div>

                        <div class="flex items-start gap-2">
                          <i class="fa-solid fa-location-dot text-rose-400 text-[11px] mt-0.5"></i>
                          <div>
                            <strong class="text-white block">Drop-off Destination</strong>
                            <span class="text-neutral-400 text-[11px]">{{ ord.deliveryAddressText }}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button (click)="claimOrder(ord.id)" 
                            class="w-full py-2 bg-gold hover:bg-gold-light text-black font-extrabold text-xs uppercase tracking-wider rounded transition-all cursor-pointer shadow flex items-center justify-center gap-2">
                      <i class="fa-solid fa-hand-holding-hand"></i> Claim Delivery
                    </button>
                  </div>
                </div>
              </div>

              <!-- In-Progress Deliveries Feed if active -->
              <div *ngIf="activeTasks.length > 0" class="bg-[#141414] border border-[#242424] rounded p-6 sm:p-8 shadow-xl">
                <div class="flex justify-between items-center pb-5 border-b border-[#242424] mb-6">
                  <div>
                    <span class="text-[10px] font-extrabold uppercase tracking-[2px] text-emerald-400 block mb-1">LIVE TRANSIT</span>
                    <h3 class="text-xl font-bold text-white flex items-center gap-2">
                      Current Active Route
                    </h3>
                    <p class="text-xs text-neutral-400 mt-1">Review live delivery task in progress and advance milestones.</p>
                  </div>
                  <a routerLink="/delivery-portal/orders" class="text-xs font-bold text-gold hover:underline flex items-center gap-1.5">
                    <span>Manage Route</span>
                    <i class="fa-solid fa-arrow-right text-[10px]"></i>
                  </a>
                </div>

                <div class="p-5 rounded bg-[#0d0d0d] border border-gold/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div class="flex items-center gap-2.5 mb-1">
                      <span class="font-extrabold text-white text-base font-mono">#{{ activeTasks[0].order.orderNumber }}</span>
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {{ activeTasks[0].status.replace('_', ' ') }}
                      </span>
                    </div>
                    <p class="text-xs text-neutral-300">
                      Destination: <strong>{{ activeTasks[0].order.deliveryAddressText }}</strong>
                    </p>
                    <p class="text-[11px] text-neutral-500 mt-0.5">
                      Pickup from {{ activeTasks[0].order.restaurant?.name || 'Restaurant' }}
                    </p>
                  </div>

                  <a routerLink="/delivery-portal/orders" 
                     class="px-5 py-2.5 bg-gold hover:bg-gold-light text-black font-extrabold text-xs uppercase tracking-wider rounded transition-all cursor-pointer shadow whitespace-nowrap">
                    Update Milestone
                  </a>
                </div>
              </div>

            </div>

            <!-- Column 3: Quick Controls & Operational Summary (1 col) -->
            <div class="space-y-6">
              
              <!-- Quick Navigation Action Cards (Matching Restaurant Side Cards) -->
              <div class="bg-[#141414] border border-[#242424] rounded p-6 shadow-xl">
                <span class="text-[10px] font-extrabold uppercase tracking-[2px] text-gold block mb-2">QUICK ACTIONS</span>
                <h4 class="text-sm font-bold text-white mb-4">Dispatcher Quick Links</h4>
                
                <div class="space-y-3">
                  <a routerLink="/delivery-portal/orders" 
                     class="flex items-center justify-between p-3.5 bg-[#0d0d0d] border border-[#202020] hover:border-gold/40 rounded transition-all group">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded bg-[#1e1910] border border-gold/30 text-gold flex items-center justify-center text-xs">
                        <i class="fa-solid fa-boxes-packing"></i>
                      </div>
                      <div>
                        <strong class="text-xs text-white block group-hover:text-gold transition-colors">Order Queue</strong>
                        <span class="text-[11px] text-neutral-500">{{ availableOrders.length }} ready tickets</span>
                      </div>
                    </div>
                    <i class="fa-solid fa-chevron-right text-neutral-500 text-xs group-hover:translate-x-1 transition-transform"></i>
                  </a>


                  <a routerLink="/delivery-portal/earnings" 
                     class="flex items-center justify-between p-3.5 bg-[#0d0d0d] border border-[#202020] hover:border-gold/40 rounded transition-all group">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded bg-[#1e1910] border border-gold/30 text-gold flex items-center justify-center text-xs">
                        <i class="fa-solid fa-wallet"></i>
                      </div>
                      <div>
                        <strong class="text-xs text-white block group-hover:text-gold transition-colors">Payout Ledger</strong>
                        <span class="text-[11px] text-neutral-500">&#36;{{ (earnings?.totalEarnings || 0) | number:'1.2-2' }}</span>
                      </div>
                    </div>
                    <i class="fa-solid fa-chevron-right text-neutral-500 text-xs group-hover:translate-x-1 transition-transform"></i>
                  </a>

                  <a routerLink="/delivery-portal/settings" 
                     class="flex items-center justify-between p-3.5 bg-[#0d0d0d] border border-[#202020] hover:border-gold/40 rounded transition-all group">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded bg-[#1e1910] border border-gold/30 text-gold flex items-center justify-center text-xs">
                        <i class="fa-solid fa-id-card"></i>
                      </div>
                      <div>
                        <strong class="text-xs text-white block group-hover:text-gold transition-colors">Profile & Vehicle</strong>
                        <span class="text-[11px] text-neutral-500">Fleet credentials</span>
                      </div>
                    </div>
                    <i class="fa-solid fa-chevron-right text-neutral-500 text-xs group-hover:translate-x-1 transition-transform"></i>
                  </a>
                </div>
              </div>

              <!-- Fleet Tier Status Card -->
              <div class="bg-[#141414] border border-[#242424] rounded p-6 shadow-xl">
                <span class="text-[10px] font-extrabold uppercase tracking-[2px] text-gold block mb-2">FLEET STATUS</span>
                <h4 class="text-sm font-bold text-white mb-3">Courier Standing</h4>
                <div class="p-4 rounded bg-[#0d0d0d] border border-[#202020] space-y-3 text-xs">
                  <div class="flex justify-between items-center">
                    <span class="text-neutral-400">Courier Tier:</span>
                    <span class="font-extrabold text-gold uppercase tracking-wider text-[11px]">Platinum Courier</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-neutral-400">On-Time Rating:</span>
                    <span class="font-bold text-emerald-400">99.4%</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-neutral-400">Acceptance Rate:</span>
                    <span class="font-bold text-white">97.8%</span>
                  </div>
                  <div class="pt-2 border-t border-[#1e1e1e] flex justify-between items-center">
                    <span class="text-neutral-400">Base Compensation:</span>
                    <strong class="text-emerald-400 font-serif">&#36;{{ (earnings?.ratePerDelivery || 4.50) | number:'1.2-2' }} / order</strong>
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
export class DeliveryDashboardComponent implements OnInit {
  currentUser: User | null = null;
  loading: boolean = false;
  isOnline: boolean = true;
  activeTasks: DeliveryAssignment[] = [];
  availableOrders: Order[] = [];
  earnings: EarningsSummary | null = null;

  constructor(
    private deliveryService: DeliveryService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    let completedRequests = 0;
    const checkDone = () => {
      completedRequests++;
      if (completedRequests >= 3) {
        this.loading = false;
      }
    };

    this.deliveryService.getTasks().subscribe({
      next: res => {
        if (res.success && res.data) {
          this.activeTasks = res.data.filter(t => t.status !== 'DELIVERED' && t.status !== 'DECLINED');
        }
        checkDone();
      },
      error: () => checkDone()
    });

    this.deliveryService.getAvailableOrders().subscribe({
      next: res => {
        if (res.success && res.data) {
          this.availableOrders = res.data;
        }
        checkDone();
      },
      error: () => checkDone()
    });

    this.deliveryService.getEarnings().subscribe({
      next: res => {
        if (res.success && res.data) {
          this.earnings = res.data;
        }
        checkDone();
      },
      error: () => checkDone()
    });
  }

  claimOrder(orderId: number): void {
    this.deliveryService.claimTask(orderId).subscribe({
      next: () => {
        this.router.navigate(['/delivery-portal/orders']);
      }
    });
  }

  toggleShiftStatus(): void {
    this.isOnline = !this.isOnline;
  }
}
