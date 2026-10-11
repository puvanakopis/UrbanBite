import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { Order, OrderStatus } from '../../../models/order.models';

interface TimelineStep {
  status: OrderStatus;
  label: string;
  desc: string;
  icon: string;
}

@Component({
  selector: 'app-order-tracking',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-[#090909] min-h-[85vh]" *ngIf="order">
      <div class="w-full max-w-7xl mx-auto px-6 py-16">
        <!-- Header Banner -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10 pb-6 border-b border-[#242424]">
          <div>
            <span class="text-xs font-bold uppercase tracking-[2.5px] text-gold mb-2 block">LIVE ORDER TRACKING</span>
            <h1 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Order #{{ order.orderNumber }}</h1>
            <p class="text-xs text-neutral-400 mt-1">Placed on {{ order.createdAt | date:'medium' }}</p>
          </div>

          <div>
            <span class="inline-flex items-center gap-2 px-4 py-2 rounded text-xs font-bold tracking-wider uppercase border"
                  [ngClass]="getStatusBadgeClasses(order.status)">
              <span class="w-2 h-2 rounded-full bg-current animate-pulse" *ngIf="isLiveStatus(order.status)"></span>
              {{ formatStatus(order.status) }}
            </span>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <!-- LEFT: LIVE TIMELINE -->
          <div class="lg:col-span-7 xl:col-span-8 bg-[#141414] border border-[#242424] rounded p-6 sm:p-8">
            <h3 class="text-xs font-bold uppercase tracking-wider text-white pb-3 border-b border-[#242424] mb-8">
              Delivery Lifecycle Progress
            </h3>

            <div class="flex flex-col">
              <div *ngFor="let step of steps; let i = index" 
                   class="flex gap-5 relative transition-opacity duration-200" 
                   [ngClass]="isStepCompleted(step.status) || order.status === step.status ? 'opacity-100' : 'opacity-35'">
                
                <div class="flex flex-col items-center w-10">
                  <div class="w-9 h-9 rounded-full flex items-center justify-center text-xs z-10 transition-colors"
                       [ngClass]="{
                         'bg-gold text-black shadow-lg shadow-gold/20': order.status === step.status,
                         'bg-white text-black': isStepCompleted(step.status) && order.status !== step.status,
                         'bg-[#181818] border border-[#333] text-neutral-500': !isStepCompleted(step.status)
                       }">
                    <i [class]="step.icon"></i>
                  </div>
                  <div class="w-0.5 flex-grow my-1 min-h-[38px] transition-colors" 
                       *ngIf="i < steps.length - 1"
                       [ngClass]="isStepCompleted(step.status) ? 'bg-white' : 'bg-[#242424]'"></div>
                </div>

                <div class="pb-8 flex-grow">
                  <div class="flex justify-between items-center mb-1">
                    <strong class="text-sm font-bold text-white">{{ step.label }}</strong>
                    <span class="text-xs text-gold font-medium" *ngIf="getStepTimestamp(step.status)">
                      {{ getStepTimestamp(step.status) | date:'shortTime' }}
                    </span>
                  </div>
                  <p class="text-xs text-neutral-400 leading-relaxed">{{ step.desc }}</p>
                </div>
              </div>
            </div>

            <!-- Cancellation Alert if Cancelled or Rejected -->
            <div *ngIf="order.status === 'CANCELLED' || order.status === 'REJECTED'" 
                 class="mt-6 p-4 rounded bg-rose-950/40 border border-rose-500/40 text-rose-400 flex gap-3 items-center text-xs">
              <i class="fa-solid fa-triangle-exclamation text-base"></i>
              <div>
                <strong class="text-sm block">Order {{ order.status === 'CANCELLED' ? 'Cancelled' : 'Rejected' }}</strong>
                <p *ngIf="order.rejectionReason" class="mt-1">Reason: {{ order.rejectionReason }}</p>
              </div>
            </div>

            <!-- Cancel Button if eligible -->
            <div *ngIf="canCancelOrder()" class="mt-8 pt-5 border-t border-[#242424] flex flex-col gap-2">
              <button (click)="cancelOrder()" 
                      [disabled]="cancelling"
                      class="px-4 py-2 border border-rose-500/40 text-rose-400 font-bold text-xs uppercase tracking-wider rounded hover:bg-rose-500 hover:text-white transition-all cursor-pointer self-start">
                {{ cancelling ? 'CANCELLING...' : 'CANCEL THIS ORDER' }}
              </button>
              <small class="text-neutral-500 text-[11px]">* Eligible for free cancellation until kitchen preparation begins.</small>
            </div>
          </div>

          <!-- RIGHT: RESTAURANT, COURIER & ITEMS BREAKDOWN -->
          <div class="lg:col-span-5 xl:col-span-4 space-y-6">
            <!-- Restaurant & Destination Card -->
            <div class="bg-[#141414] border border-[#242424] rounded p-6">
              <h4 class="text-xs font-bold uppercase tracking-wider text-white pb-3 border-b border-[#242424] mb-4">
                Kitchen & Courier
              </h4>
              <div class="flex gap-3.5 text-xs">
                <i class="fa-solid fa-store text-neutral-500 text-sm mt-0.5"></i>
                <div>
                  <strong class="text-white block text-sm mb-0.5">{{ order.restaurant?.name }}</strong>
                  <p class="text-neutral-400 leading-relaxed">{{ order.restaurant?.address }}, {{ order.restaurant?.city }}</p>
                </div>
              </div>

              <div class="h-px bg-[#242424] my-4"></div>

              <div class="flex gap-3.5 text-xs">
                <i class="fa-solid fa-location-dot text-neutral-500 text-sm mt-0.5"></i>
                <div>
                  <strong class="text-white block text-sm mb-0.5">Delivery Address</strong>
                  <p class="text-neutral-400 leading-relaxed">{{ order.deliveryAddressText }}</p>
                  <small *ngIf="order.customerNotes" class="text-neutral-500 block mt-1">Note: {{ order.customerNotes }}</small>
                </div>
              </div>

              <div class="h-px bg-[#242424] my-4" *ngIf="order.deliveryPartner"></div>

              <div class="flex gap-3.5 text-xs" *ngIf="order.deliveryPartner">
                <i class="fa-solid fa-motorcycle text-gold text-sm mt-0.5"></i>
                <div>
                  <strong class="text-white block text-sm mb-0.5">Courier: {{ order.deliveryPartner.fullName }}</strong>
                  <p class="text-neutral-400">Contact: {{ order.deliveryPartner.phone || 'Courier on duty' }}</p>
                </div>
              </div>
            </div>

            <!-- Items & Financial Summary -->
            <div class="bg-[#141414] border border-[#242424] rounded p-6">
              <h4 class="text-xs font-bold uppercase tracking-wider text-white pb-3 border-b border-[#242424] mb-4">
                Order Items ({{ order.items.length }})
              </h4>
              <div class="space-y-3 mb-4">
                <div *ngFor="let it of order.items" class="flex justify-between items-start text-xs">
                  <div>
                    <span class="text-white font-semibold block">{{ it.quantity }}x {{ it.itemName }}</span>
                    <small *ngIf="it.variantName" class="text-neutral-500 block">{{ it.variantName }}</small>
                    <small *ngIf="it.addonsSummary" class="text-neutral-500 block">+ {{ it.addonsSummary }}</small>
                  </div>
                  <span class="text-white font-semibold">&#36;{{ it.itemTotal | number:'1.2-2' }}</span>
                </div>
              </div>

              <div class="h-px bg-[#242424] my-4"></div>

              <div class="space-y-2.5 text-xs">
                <div class="flex justify-between text-neutral-400">
                  <span>Subtotal</span>
                  <span class="text-white">&#36;{{ order.subtotal | number:'1.2-2' }}</span>
                </div>
                <div class="flex justify-between text-gold font-semibold" *ngIf="order.discountAmount > 0">
                  <span>Discount</span>
                  <span>-&#36;{{ order.discountAmount | number:'1.2-2' }}</span>
                </div>
                <div class="flex justify-between text-neutral-400">
                  <span>Delivery Fee</span>
                  <span class="text-white">&#36;{{ order.deliveryFee | number:'1.2-2' }}</span>
                </div>
                <div class="flex justify-between text-neutral-400">
                  <span>Taxes (5%)</span>
                  <span class="text-white">&#36;{{ order.taxAmount | number:'1.2-2' }}</span>
                </div>
                <div class="flex justify-between items-baseline pt-2 border-t border-[#242424]">
                  <span class="text-sm font-bold text-white">Total Paid</span>
                  <span class="text-lg font-black text-white">&#36;{{ order.totalAmount | number:'1.2-2' }}</span>
                </div>
                <div class="text-[11px] text-neutral-500 pt-1">
                  <span>Payment: {{ order.paymentMethod === 'ONLINE_SIMULATOR' ? 'Online Simulator (Paid)' : 'Cash on Delivery' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class OrderTrackingComponent implements OnInit, OnDestroy {
  order: Order | null = null;
  cancelling: boolean = false;
  pollInterval: any;

  steps: TimelineStep[] = [
    {
      status: 'PLACED',
      label: 'Order Placed',
      desc: 'Order received and recorded in our kitchen registry.',
      icon: 'fa-regular fa-clipboard'
    },
    {
      status: 'ACCEPTED',
      label: 'Order Confirmed',
      desc: 'Executive chef has accepted and reviewed order specifics.',
      icon: 'fa-solid fa-check'
    },
    {
      status: 'PREPARING',
      label: 'Food Preparation',
      desc: 'Artisanal ingredients are being sautéed, blistered, and plated.',
      icon: 'fa-solid fa-fire-burner'
    },
    {
      status: 'READY_FOR_PICKUP',
      label: 'Ready for Pickup',
      desc: 'Packaged in thermal containers and handed over to courier.',
      icon: 'fa-solid fa-box-archive'
    },
    {
      status: 'OUT_FOR_DELIVERY',
      label: 'Out for Doorstep Delivery',
      desc: 'Your dedicated courier is actively en route to your residence.',
      icon: 'fa-solid fa-motorcycle'
    },
    {
      status: 'DELIVERED',
      label: 'Safely Delivered',
      desc: 'Order completed. Enjoy your dining experience!',
      icon: 'fa-solid fa-house-chimney-user'
    }
  ];

  constructor(private route: ActivatedRoute, private orderService: OrderService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const num = params['orderNumber'];
      if (num) {
        this.loadOrder(num);
        this.pollInterval = setInterval(() => this.loadOrder(num), 8000);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
    }
  }

  loadOrder(orderNumber: string): void {
    this.orderService.getOrderByNumber(orderNumber).subscribe({
      next: res => {
        if (res.success && res.data) {
          this.order = res.data;
        }
      }
    });
  }

  isStepCompleted(status: OrderStatus): boolean {
    if (!this.order) return false;
    const orderIndex = this.steps.findIndex(s => s.status === this.order!.status);
    const stepIndex = this.steps.findIndex(s => s.status === status);
    return stepIndex <= orderIndex && orderIndex !== -1;
  }

  getStepTimestamp(status: OrderStatus): string | null {
    if (!this.order || !this.order.statusHistory) return null;
    const item = this.order.statusHistory.find(h => h.status === status);
    return item ? item.timestamp : null;
  }

  canCancelOrder(): boolean {
    if (!this.order) return false;
    return this.order.status === 'PLACED' || this.order.status === 'ACCEPTED';
  }

  cancelOrder(): void {
    if (!this.order) return;
    this.cancelling = true;
    this.orderService.cancelOrder(this.order.id, 'Customer requested cancellation via portal').subscribe({
      next: res => {
        this.cancelling = false;
        if (res.success && res.data) {
          this.order = res.data;
        }
      },
      error: () => {
        this.cancelling = false;
      }
    });
  }

  isLiveStatus(status: OrderStatus): boolean {
    return status !== 'DELIVERED' && status !== 'CANCELLED' && status !== 'REJECTED';
  }

  formatStatus(status: OrderStatus): string {
    return status.replace(/_/g, ' ');
  }

  getStatusBadgeClasses(status: OrderStatus): string {
    if (status === 'DELIVERED') return 'border-emerald-500/40 bg-emerald-950/40 text-emerald-400';
    if (status === 'CANCELLED' || status === 'REJECTED') return 'border-rose-500/40 bg-rose-950/40 text-rose-400';
    return 'border-gold/40 bg-gold/10 text-gold';
  }
}
