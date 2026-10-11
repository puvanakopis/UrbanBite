import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../services/cart.service';
import { OrderService } from '../../../services/order.service';
import { AuthService } from '../../../services/auth.service';
import { CartItem, Address } from '../../../models/order.models';
import { UserSidebarComponent } from '../../../components/user-sidebar/user-sidebar.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, UserSidebarComponent],
  template: `
    <div class="bg-[#090909] min-h-[85vh] py-12 sm:py-16">
      <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <!-- Grid Layout: Sidebar Navigation + Cart Content -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          <!-- Left Column: User Sidebar Navigation -->
          <div class="lg:col-span-3">
            <app-user-sidebar></app-user-sidebar>
          </div>

          <!-- Right Column: Cart Content -->
          <div class="lg:col-span-9 space-y-8">

            <div class="mb-2">
              <span class="text-xs font-bold uppercase tracking-[2.5px] text-gold mb-3 inline-block">ADD TO CART</span>
              <h1 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Your Cart Items</h1>
            </div>

            <!-- EMPTY STATE -->
            <div *ngIf="items.length === 0" class="bg-[#141414] border border-[#242424] rounded p-12 text-center max-w-xl mx-auto shadow-xl">
              <i class="fa-solid fa-bag-shopping text-5xl text-neutral-700 mb-5 block"></i>
              <h2 class="text-2xl font-bold text-white mb-3">Your Cart is Empty</h2>
              <p class="text-sm text-neutral-400 mb-8 leading-relaxed">Indulge in artisanal dishes and add them to your cart from our celebrated restaurant partners.</p>
              <a routerLink="/restaurants" class="inline-flex px-6 py-3 bg-white text-black font-bold text-xs uppercase tracking-wider rounded hover:bg-neutral-200 transition-all">
                EXPLORE RESTAURANTS & ADD DISHES
              </a>
            </div>

            <!-- MAIN CHECKOUT LAYOUT -->
            <div *ngIf="items.length > 0" class="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
              <!-- LEFT: ITEMS LIST & DELIVERY DETAILS -->
              <div class="xl:col-span-7 space-y-6">
                <!-- Restaurant Info Card -->
                <div class="bg-[#111] border border-[#242424] rounded p-5 flex justify-between items-center">
                  <div>
                    <span class="text-[10px] font-bold tracking-wider text-gold uppercase block">ADDED FROM</span>
                    <h3 class="text-lg font-bold text-white mt-1">{{ cartService.restaurantName }}</h3>
                  </div>
              <button (click)="clearCart()" class="text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors cursor-pointer">
                Clear Cart
              </button>
            </div>

            <!-- Items List -->
            <div class="bg-[#141414] border border-[#242424] rounded p-6">
              <h4 class="text-xs font-bold uppercase tracking-wider text-white pb-3 border-b border-[#242424] mb-4">
                Cart Items ({{ items.length }})
              </h4>
              <div class="divide-y divide-[#1f1f1f]">
                <div *ngFor="let item of items; let i = index" class="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h5 class="text-sm font-bold text-white">{{ item.menuItem.name }}</h5>
                    <div class="flex flex-wrap gap-1.5 my-1.5" *ngIf="item.selectedVariant || (item.selectedAddons && item.selectedAddons.length > 0)">
                      <span *ngIf="item.selectedVariant" class="text-[10px] bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded">{{ item.selectedVariant.name }}</span>
                      <span *ngFor="let a of item.selectedAddons" class="text-[10px] bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded">+ {{ a.name }}</span>
                    </div>
                    <span class="text-xs text-neutral-500">&#36;{{ item.unitPrice | number:'1.2-2' }} each</span>
                  </div>

                  <div class="flex items-center gap-4 self-end sm:self-center">
                    <div class="flex items-center bg-[#181818] border border-[#242424] rounded">
                      <button (click)="updateQty(i, item.quantity - 1)" class="px-2.5 py-1 text-white hover:bg-neutral-800 cursor-pointer">-</button>
                      <span class="px-2 text-xs font-bold text-white">{{ item.quantity }}</span>
                      <button (click)="updateQty(i, item.quantity + 1)" class="px-2.5 py-1 text-white hover:bg-neutral-800 cursor-pointer">+</button>
                    </div>
                    <span class="text-sm font-bold text-white min-w-[65px] text-right">&#36;{{ item.itemTotal | number:'1.2-2' }}</span>
                    <button (click)="removeItem(i)" class="text-neutral-500 hover:text-rose-400 cursor-pointer transition-colors" title="Remove item">
                      <i class="fa-regular fa-trash-can text-sm"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Delivery Address Card -->
            <div class="bg-[#141414] border border-[#242424] rounded p-6">
              <h4 class="text-xs font-bold uppercase tracking-wider text-white pb-3 border-b border-[#242424] mb-4">
                Delivery Destination
              </h4>

              <!-- Saved Addresses if logged in -->
              <div *ngIf="savedAddresses.length > 0" class="space-y-2.5 mb-5">
                <label *ngFor="let addr of savedAddresses" 
                       [ngClass]="selectedAddressId === addr.id ? 'border-white bg-[#1f1f1f]' : 'border-[#242424] bg-[#181818] hover:border-neutral-700'"
                       class="flex items-start gap-3 p-3.5 border rounded cursor-pointer transition-colors">
                  <input type="radio" name="addressSelect" [value]="addr.id" [(ngModel)]="selectedAddressId" (change)="onAddressSelected(addr)" class="mt-1 accent-white" />
                  <div class="text-xs flex flex-col">
                    <strong class="text-white">{{ addr.label }}</strong>
                    <span class="text-neutral-400">{{ addr.streetAddress }}, {{ addr.city }}</span>
                    <small *ngIf="addr.deliveryInstructions" class="text-neutral-500 mt-0.5">{{ addr.deliveryInstructions }}</small>
                  </div>
                </label>
              </div>

              <!-- Inline or Manual Address input -->
              <div class="space-y-4">
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Delivery Street Address</label>
                  <input 
                    type="text" 
                    [(ngModel)]="deliveryAddress" 
                    placeholder="e.g. 742 Evergreen Terrace, Apt 4B, New York, NY 10001" 
                    required 
                    class="w-full px-4 py-3 bg-[#181818] border border-[#242424] rounded text-white text-sm outline-none focus:border-white transition-colors" />
                </div>

                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Special Delivery / Kitchen Instructions (Optional)</label>
                  <input 
                    type="text" 
                    [(ngModel)]="customerNotes" 
                    placeholder="e.g. Ring buzzer 4B, please include extra chili oil" 
                    class="w-full px-4 py-3 bg-[#181818] border border-[#242424] rounded text-white text-sm outline-none focus:border-white transition-colors" />
                </div>
              </div>
            </div>

            <!-- Payment Method Card -->
            <div class="bg-[#141414] border border-[#242424] rounded p-6">
              <h4 class="text-xs font-bold uppercase tracking-wider text-white pb-3 border-b border-[#242424] mb-4">
                Payment Method
              </h4>
              <div class="space-y-3">
                <label [ngClass]="paymentMethod === 'CASH_ON_DELIVERY' ? 'border-white bg-[#1f1f1f]' : 'border-[#242424] bg-[#181818] hover:border-neutral-700'"
                       class="flex items-center gap-3.5 p-4 border rounded cursor-pointer transition-colors">
                  <input type="radio" name="paymentMethod" value="CASH_ON_DELIVERY" [(ngModel)]="paymentMethod" class="accent-white" />
                  <div class="flex flex-col">
                    <strong class="text-sm text-white"><i class="fa-solid fa-money-bill-wave text-gold mr-1.5"></i> Cash on Delivery</strong>
                    <span class="text-xs text-neutral-400">Pay directly to courier upon arrival</span>
                  </div>
                </label>

                <label [ngClass]="paymentMethod === 'ONLINE_SIMULATOR' ? 'border-white bg-[#1f1f1f]' : 'border-[#242424] bg-[#181818] hover:border-neutral-700'"
                       class="flex items-center gap-3.5 p-4 border rounded cursor-pointer transition-colors">
                  <input type="radio" name="paymentMethod" value="ONLINE_SIMULATOR" [(ngModel)]="paymentMethod" class="accent-white" />
                  <div class="flex flex-col">
                    <strong class="text-sm text-white"><i class="fa-solid fa-credit-card text-gold mr-1.5"></i> Online Simulator (Instant Card/UPI)</strong>
                    <span class="text-xs text-neutral-400">Simulate verified electronic payment</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <!-- RIGHT: ORDER SUMMARY & CHECKOUT BUTTON -->
          <div class="xl:col-span-5">
            <div class="bg-[#141414] border border-[#242424] rounded p-6 sticky top-24">
              <h4 class="text-xs font-bold uppercase tracking-wider text-white pb-3 border-b border-[#242424] mb-5">
                Cart Summary
              </h4>

              <!-- Price Breakdown -->
              <div class="space-y-3 mb-6">
                <div class="flex justify-between text-xs text-neutral-400">
                  <span>Subtotal</span>
                  <span class="text-white">&#36;{{ cartService.getSubtotal() | number:'1.2-2' }}</span>
                </div>

                <div class="flex justify-between text-xs text-neutral-400">
                  <span>Delivery Fee</span>
                  <span class="text-white">&#36;{{ cartService.getDeliveryFee() | number:'1.2-2' }}</span>
                </div>

                <div class="flex justify-between text-xs text-neutral-400">
                  <span>Taxes (5% Gastronomy)</span>
                  <span class="text-white">&#36;{{ cartService.getTax() | number:'1.2-2' }}</span>
                </div>

                <div class="h-px bg-[#242424] my-2"></div>

                <div class="flex justify-between items-baseline pt-1">
                  <span class="text-sm font-bold text-white">Total Amount</span>
                  <span class="text-xl font-black text-white">&#36;{{ cartService.getTotal() | number:'1.2-2' }}</span>
                </div>
              </div>

              <!-- Order Submit Action -->
              <div>
                <button 
                  (click)="placeOrder()" 
                  [disabled]="isPlacingOrder || !deliveryAddress" 
                  class="w-full py-4 bg-white text-black font-bold text-xs uppercase tracking-wider rounded hover:bg-neutral-200 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
                  {{ isPlacingOrder ? 'PROCESSING ORDER...' : 'CHECKOUT & PLACE ORDER • $' + (cartService.getTotal() | number:'1.2-2') }}
                </button>
                <p *ngIf="!deliveryAddress" class="text-[11px] text-neutral-500 text-center mt-2.5">
                  * Please provide a delivery destination above to proceed to checkout.
                </p>
                <div *ngIf="orderError" class="text-xs text-rose-400 text-center mt-3">
                  <i class="fa-solid fa-circle-exclamation mr-1"></i> {{ orderError }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  `
})
export class CartComponent implements OnInit {
  items: CartItem[] = [];
  savedAddresses: Address[] = [];
  selectedAddressId?: number;

  deliveryAddress: string = '';
  customerNotes: string = '';
  paymentMethod: string = 'ONLINE_SIMULATOR';

  isPlacingOrder: boolean = false;
  orderError: string = '';

  constructor(
    public cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(items => this.items = items);

    if (this.authService.isAuthenticated()) {
      this.orderService.getAddresses().subscribe({
        next: res => {
          if (res.success && res.data) {
            this.savedAddresses = res.data;
            const defaultAddr = this.savedAddresses.find(a => a.isDefault) || this.savedAddresses[0];
            if (defaultAddr) {
              this.selectedAddressId = defaultAddr.id;
              this.deliveryAddress = `${defaultAddr.streetAddress}, ${defaultAddr.city || ''}`;
              if (defaultAddr.deliveryInstructions) {
                this.customerNotes = defaultAddr.deliveryInstructions;
              }
            }
          }
        }
      });
    }
  }

  updateQty(index: number, quantity: number): void {
    this.cartService.updateQuantity(index, quantity);
  }

  removeItem(index: number): void {
    this.cartService.removeItem(index);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  onAddressSelected(addr: Address): void {
    this.deliveryAddress = `${addr.streetAddress}, ${addr.city || ''}`;
    if (addr.deliveryInstructions) {
      this.customerNotes = addr.deliveryInstructions;
    }
  }

  placeOrder(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.deliveryAddress.trim()) {
      this.orderError = 'Please specify a delivery street address.';
      return;
    }

    const restaurantId = this.cartService.restaurantId;
    if (!restaurantId || this.items.length === 0) return;

    this.isPlacingOrder = true;
    this.orderError = '';

    const payload = {
      restaurantId: restaurantId,
      items: this.items.map(i => ({
        menuItemId: i.menuItem.id,
        quantity: i.quantity,
        variantName: i.selectedVariant?.name,
        variantPriceAdjustment: i.selectedVariant?.priceAdjustment || 0,
        addonNames: i.selectedAddons.map(a => a.name),
        addonsTotalPrice: i.selectedAddons.reduce((sum, a) => sum + Number(a.price), 0)
      })),
      deliveryAddressText: this.deliveryAddress.trim(),
      customerNotes: this.customerNotes.trim() || undefined,
      paymentMethod: this.paymentMethod
    };

    this.orderService.createOrder(payload).subscribe({
      next: res => {
        this.isPlacingOrder = false;
        if (res.success && res.data) {
          this.cartService.clearCart();
          this.router.navigate(['/orders', res.data.orderNumber]);
        } else {
          this.orderError = res.message || 'Failed to place order.';
        }
      },
      error: err => {
        this.isPlacingOrder = false;
        this.orderError = err.error?.message || 'Server error while processing your order.';
      }
    });
  }
}
