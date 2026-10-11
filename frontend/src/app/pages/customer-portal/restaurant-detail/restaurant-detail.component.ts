import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RestaurantService } from '../../../services/restaurant.service';
import { MenuService } from '../../../services/menu.service';
import { CartService } from '../../../services/cart.service';
import { OrderService } from '../../../services/order.service';
import { Restaurant, MenuCategory, MenuItem, MenuItemVariant, MenuItemAddon } from '../../../models/restaurant.models';
import { Review } from '../../../models/order.models';

@Component({
  selector: 'app-restaurant-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="bg-[#090909] min-h-screen" *ngIf="restaurant">
      <!-- RESTAURANT BANNER HEADER -->
      <section class="relative py-24 sm:py-28 overflow-hidden">
        <div class="absolute inset-0 bg-cover bg-center filter blur-sm brightness-[0.22] scale-105" [style.backgroundImage]="'url(' + restaurant.imageUrl + ')'"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-[#090909] via-[#090909]/80 to-[#090909]/50"></div>
        
        <div class="relative z-10 w-full max-w-7xl mx-auto px-6">
          <div class="max-w-3xl">
            <div class="flex items-center gap-3 mb-4">
              <span class="text-[11px] font-extrabold tracking-wider px-3 py-1 rounded bg-black/80 border"
                    [ngClass]="restaurant.isOpen ? 'text-emerald-400 border-emerald-500/40' : 'text-neutral-400 border-neutral-700'">
                {{ restaurant.isOpen ? 'OPEN NOW' : 'CLOSED' }}
              </span>
              <span class="text-[11px] font-bold tracking-widest text-gold uppercase px-3 py-1 bg-gold/10 border border-gold/30 rounded">
                {{ restaurant.cuisine }}
              </span>
            </div>

            <h1 class="text-4xl sm:text-6xl font-black text-white tracking-tight mb-3">{{ restaurant.name }}</h1>
            <p class="text-base text-neutral-300 leading-relaxed mb-6">{{ restaurant.tagline || restaurant.description }}</p>

            <div class="flex flex-wrap gap-6 sm:gap-10 py-5 border-y border-[#242424] mb-5">
              <div>
                <span class="block text-xl font-bold text-gold"><i class="fa-solid fa-star text-sm"></i> {{ restaurant.rating }}</span>
                <span class="text-[11px] text-neutral-400 uppercase tracking-wider">{{ restaurant.totalReviews }} Reviews</span>
              </div>
              <div>
                <span class="block text-xl font-bold text-white">{{ restaurant.avgDeliveryTimeMinutes }} min</span>
                <span class="text-[11px] text-neutral-400 uppercase tracking-wider">Estimated Delivery</span>
              </div>
              <div>
                <span class="block text-xl font-bold text-white">&#36;{{ restaurant.deliveryFee }}</span>
                <span class="text-[11px] text-neutral-400 uppercase tracking-wider">Delivery Fee</span>
              </div>
              <div>
                <span class="block text-xl font-bold text-white">&#36;{{ restaurant.minOrderAmount }}</span>
                <span class="text-[11px] text-neutral-400 uppercase tracking-wider">Min. Order</span>
              </div>
            </div>

            <div class="flex items-center gap-2 text-xs sm:text-sm text-neutral-400 flex-wrap">
              <i class="fa-regular fa-clock text-neutral-500"></i>
              <span>Hours: {{ restaurant.openingHours || '11:00 AM - 11:00 PM Daily' }}</span>
              <span class="text-neutral-600">•</span>
              <span>{{ restaurant.address }}, {{ restaurant.city }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- MENU TABS & CONTENT -->
      <section class="py-12 pb-24">
        <div class="w-full max-w-7xl mx-auto px-6">
          <!-- Category Tabs Navigation -->
          <div class="mb-10 border-b border-[#242424] overflow-x-auto pb-4">
            <div class="flex gap-2.5">
              <button 
                (click)="selectedCategory = 'ALL'" 
                [ngClass]="selectedCategory === 'ALL' ? 'bg-white text-black font-bold border-white' : 'bg-transparent text-neutral-400 border-[#242424] hover:text-white hover:border-neutral-600'"
                class="px-4 py-2 text-xs font-semibold rounded border transition-colors cursor-pointer whitespace-nowrap">
                All Items
              </button>
              <button 
                *ngFor="let cat of categories" 
                (click)="selectedCategory = cat.name" 
                [ngClass]="selectedCategory === cat.name ? 'bg-white text-black font-bold border-white' : 'bg-transparent text-neutral-400 border-[#242424] hover:text-white hover:border-neutral-600'"
                class="px-4 py-2 text-xs font-semibold rounded border transition-colors cursor-pointer whitespace-nowrap">
                {{ cat.name }}
              </button>
              <button 
                (click)="selectedCategory = 'REVIEWS'" 
                [ngClass]="selectedCategory === 'REVIEWS' ? 'bg-white text-black font-bold border-white' : 'bg-transparent text-neutral-400 border-[#242424] hover:text-white hover:border-neutral-600'"
                class="px-4 py-2 text-xs font-semibold rounded border transition-colors cursor-pointer whitespace-nowrap">
                Reviews ({{ reviews.length }})
              </button>
            </div>
          </div>

          <!-- REVIEWS TAB -->
          <div *ngIf="selectedCategory === 'REVIEWS'">
            <h3 class="text-2xl font-bold text-white mb-6">Guest Reviews & Ratings</h3>
            <div *ngIf="reviews.length === 0" class="text-center py-16 bg-[#141414] border border-[#242424] rounded">
              <p class="text-neutral-400 text-sm">No reviews yet for this restaurant. Be the first to order and leave feedback!</p>
            </div>
            <div *ngIf="reviews.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div *ngFor="let r of reviews" class="bg-[#141414] border border-[#242424] rounded p-6 flex flex-col justify-between">
                <div>
                  <div class="flex gap-1 text-xs text-neutral-600 mb-3">
                    <i class="fa-solid fa-star" *ngFor="let s of [1,2,3,4,5]" [ngClass]="{'text-gold': s <= r.rating}"></i>
                  </div>
                  <p class="text-sm text-neutral-300 italic mb-4 leading-relaxed">"{{ r.comment }}"</p>
                </div>
                <div>
                  <div class="flex justify-between items-center text-xs text-neutral-500 pt-3 border-t border-[#1f1f1f]">
                    <span class="font-semibold text-neutral-400">{{ r.customer?.fullName || 'Verified Guest' }}</span>
                    <span>{{ r.createdAt | date:'mediumDate' }}</span>
                  </div>
                  <div *ngIf="r.restaurantReply" class="mt-3 p-3 bg-[#181818] border-l-2 border-gold text-xs text-neutral-300">
                    <strong class="text-white">Chef's Response:</strong> {{ r.restaurantReply }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- FOOD ITEMS GRID -->
          <div *ngIf="selectedCategory !== 'REVIEWS'" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div *ngFor="let item of filteredItems" class="bg-[#141414] border border-[#242424] rounded p-5 flex flex-col sm:flex-row gap-5 hover:border-neutral-600 hover:bg-[#161616] transition-all group">
              <div class="relative w-full sm:w-32 h-44 sm:h-32 rounded overflow-hidden flex-shrink-0" *ngIf="item.imageUrl">
                <img [src]="item.imageUrl" [alt]="item.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <span *ngIf="item.isVegetarian" class="absolute bottom-1.5 left-1.5 text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-600 text-white flex items-center gap-1">
                  <i class="fa-solid fa-leaf"></i> VEG
                </span>
                <span *ngIf="item.isSpicy" class="absolute bottom-1.5 left-1.5 text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-rose-600 text-white flex items-center gap-1">
                  <i class="fa-solid fa-pepper-hot"></i> SPICY
                </span>
              </div>

              <div class="flex flex-col flex-grow justify-between">
                <div>
                  <div class="flex justify-between items-baseline gap-2 mb-1.5">
                    <h4 class="text-base font-bold text-white">{{ item.name }}</h4>
                    <span class="text-base font-bold text-gold">&#36;{{ item.price | number:'1.2-2' }}</span>
                  </div>
                  <p class="text-xs text-neutral-400 line-clamp-2 leading-relaxed mb-4">{{ item.description }}</p>
                </div>

                <div class="flex items-center justify-between pt-3 border-t border-[#1f1f1f]">
                  <span *ngIf="item.variants && item.variants.length > 0" class="text-[11px] text-neutral-500 italic">
                    Customizable
                  </span>
                  <button 
                    (click)="openCustomizationModal(item)" 
                    [disabled]="!restaurant.isOpen || !item.isAvailable" 
                    class="ml-auto px-4 py-2 border border-neutral-700 text-white font-bold text-xs uppercase tracking-wider rounded hover:border-white hover:bg-white/5 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
                    <i class="fa-solid fa-plus mr-1"></i> ADD
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ITEM CUSTOMIZATION MODAL -->
      <div *ngIf="activeModalItem" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <div class="bg-[#141414] border border-[#333] rounded w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          <div class="p-6 border-b border-[#242424] flex justify-between items-start">
            <div>
              <h3 class="text-xl font-bold text-white">{{ activeModalItem.name }}</h3>
              <span class="text-sm font-semibold text-gold">Base: &#36;{{ activeModalItem.price | number:'1.2-2' }}</span>
            </div>
            <button (click)="closeModal()" class="text-neutral-500 hover:text-white text-lg cursor-pointer"><i class="fa-solid fa-xmark"></i></button>
          </div>

          <div class="p-6 overflow-y-auto space-y-6">
            <p class="text-sm text-neutral-400 leading-relaxed">{{ activeModalItem.description }}</p>

            <!-- Variants (Portion size) -->
            <div *ngIf="activeModalItem.variants && activeModalItem.variants.length > 0" class="pt-4 border-t border-[#242424]">
              <label class="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">Select Portion / Variant</label>
              <div class="space-y-2.5">
                <label *ngFor="let v of activeModalItem.variants" 
                       class="flex items-center justify-between p-3 bg-[#1a1a1a] border border-[#242424] hover:border-neutral-600 rounded cursor-pointer text-sm text-white">
                  <div class="flex items-center gap-3">
                    <input type="radio" name="variant" [value]="v" [(ngModel)]="selectedVariant" class="accent-white" />
                    <span>{{ v.name }}</span>
                  </div>
                  <strong *ngIf="v.priceAdjustment > 0" class="text-gold">+&#36;{{ v.priceAdjustment | number:'1.2-2' }}</strong>
                </label>
              </div>
            </div>

            <!-- Addons -->
            <div *ngIf="activeModalItem.addons && activeModalItem.addons.length > 0" class="pt-4 border-t border-[#242424]">
              <label class="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">Artisan Add-ons & Extras</label>
              <div class="space-y-2.5">
                <label *ngFor="let a of activeModalItem.addons" 
                       class="flex items-center justify-between p-3 bg-[#1a1a1a] border border-[#242424] hover:border-neutral-600 rounded cursor-pointer text-sm text-white">
                  <div class="flex items-center gap-3">
                    <input type="checkbox" [checked]="isAddonSelected(a)" (change)="toggleAddon(a)" class="accent-white" />
                    <span>{{ a.name }}</span>
                  </div>
                  <strong class="text-gold">+&#36;{{ a.price | number:'1.2-2' }}</strong>
                </label>
              </div>
            </div>

            <!-- Quantity Selector -->
            <div class="pt-4 border-t border-[#242424]">
              <label class="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">Quantity</label>
              <div class="flex items-center gap-4">
                <button (click)="adjustQty(-1)" class="w-9 h-9 bg-[#202020] border border-[#333] text-white text-lg font-bold rounded cursor-pointer hover:bg-neutral-800 disabled:opacity-40" [disabled]="modalQuantity <= 1">-</button>
                <span class="text-lg font-bold text-white min-w-8 text-center">{{ modalQuantity }}</span>
                <button (click)="adjustQty(1)" class="w-9 h-9 bg-[#202020] border border-[#333] text-white text-lg font-bold rounded cursor-pointer hover:bg-neutral-800">+</button>
              </div>
            </div>
          </div>

          <div class="p-6 border-t border-[#242424] bg-[#111]">
            <button (click)="confirmAddToCart()" 
                    class="w-full py-3.5 bg-white text-black font-bold text-xs uppercase tracking-wider rounded hover:bg-neutral-200 transition-all cursor-pointer">
              ADD TO ORDER • &#36;{{ calculateModalTotal() | number:'1.2-2' }}
            </button>
          </div>
        </div>
      </div>

      <!-- REPLACE CART CONFLICT MODAL (Multi-restaurant policy enforcement) -->
      <div *ngIf="showReplaceCartModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <div class="bg-[#141414] border border-[#333] rounded w-full max-w-lg shadow-2xl overflow-hidden p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold text-white">Start New Basket?</h3>
            <button (click)="showReplaceCartModal = false" class="text-neutral-500 hover:text-white text-lg cursor-pointer"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <div class="space-y-3 text-sm text-neutral-300 leading-relaxed mb-6">
            <p>Your current cart contains items from <strong class="text-white">{{ cartService.restaurantName }}</strong>.</p>
            <p>UrbanBite orders are prepared and delivered exclusively from one premier kitchen at a time to ensure optimal temperature and timing.</p>
            <p>Would you like to clear your current cart and add items from <strong class="text-white">{{ restaurant.name }}</strong>?</p>
          </div>
          <div class="flex flex-col sm:flex-row gap-3 justify-end">
            <button (click)="showReplaceCartModal = false" class="px-5 py-2.5 border border-neutral-700 text-white font-bold text-xs uppercase tracking-wider rounded hover:border-white hover:bg-white/5 transition-all">
              KEEP CURRENT BASKET
            </button>
            <button (click)="confirmReplaceCart()" class="px-5 py-2.5 bg-white text-black font-bold text-xs uppercase tracking-wider rounded hover:bg-neutral-200 transition-all">
              CLEAR & ADD NEW ITEM
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RestaurantDetailComponent implements OnInit {
  restaurant: Restaurant | null = null;
  categories: MenuCategory[] = [];
  items: MenuItem[] = [];
  reviews: Review[] = [];

  selectedCategory: string = 'ALL';

  // Customization modal state
  activeModalItem: MenuItem | null = null;
  selectedVariant?: MenuItemVariant;
  selectedAddons: MenuItemAddon[] = [];
  modalQuantity: number = 1;

  // Conflict modal state
  showReplaceCartModal: boolean = false;
  pendingAddItem?: { item: MenuItem; variant?: MenuItemVariant; addons: MenuItemAddon[]; qty: number };

  constructor(
    private route: ActivatedRoute,
    private restaurantService: RestaurantService,
    private menuService: MenuService,
    public cartService: CartService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = Number(params['id']);
      if (id) {
        this.loadRestaurantDetails(id);
      }
    });
  }

  loadRestaurantDetails(id: number): void {
    this.restaurantService.getRestaurantById(id).subscribe({
      next: res => {
        if (res.success && res.data) {
          this.restaurant = res.data;
          this.loadMenu(id);
          this.loadReviews(id);
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

    this.menuService.getItems(restaurantId, true).subscribe({
      next: res => {
        if (res.success && res.data) {
          this.items = res.data;
        }
      }
    });
  }

  loadReviews(restaurantId: number): void {
    this.orderService.getReviewsForRestaurant(restaurantId).subscribe({
      next: res => {
        if (res.success && res.data) {
          this.reviews = res.data;
        }
      }
    });
  }

  get filteredItems(): MenuItem[] {
    if (this.selectedCategory === 'ALL') {
      return this.items;
    }
    return this.items.filter(i => i.category && i.category.name === this.selectedCategory);
  }

  openCustomizationModal(item: MenuItem): void {
    this.activeModalItem = item;
    this.modalQuantity = 1;
    this.selectedVariant = item.variants && item.variants.length > 0 ? item.variants[0] : undefined;
    this.selectedAddons = [];
  }

  closeModal(): void {
    this.activeModalItem = null;
  }

  toggleAddon(addon: MenuItemAddon): void {
    const idx = this.selectedAddons.findIndex(a => a.name === addon.name);
    if (idx > -1) {
      this.selectedAddons.splice(idx, 1);
    } else {
      this.selectedAddons.push(addon);
    }
  }

  isAddonSelected(addon: MenuItemAddon): boolean {
    return this.selectedAddons.some(a => a.name === addon.name);
  }

  adjustQty(delta: number): void {
    this.modalQuantity = Math.max(1, this.modalQuantity + delta);
  }

  calculateModalTotal(): number {
    if (!this.activeModalItem) return 0;
    let unit = Number(this.activeModalItem.price);
    if (this.selectedVariant && this.selectedVariant.priceAdjustment) {
      unit += Number(this.selectedVariant.priceAdjustment);
    }
    const addonsTotal = this.selectedAddons.reduce((sum, a) => sum + Number(a.price), 0);
    unit += addonsTotal;
    return unit * this.modalQuantity;
  }

  confirmAddToCart(): void {
    if (!this.activeModalItem || !this.restaurant) return;

    const added = this.cartService.addToCart(
      this.activeModalItem,
      this.restaurant.id,
      this.restaurant.name,
      this.modalQuantity,
      this.selectedVariant,
      this.selectedAddons
    );

    if (!added) {
      // Restaurant mismatch! Prompt replace cart
      this.pendingAddItem = {
        item: this.activeModalItem,
        variant: this.selectedVariant,
        addons: this.selectedAddons,
        qty: this.modalQuantity
      };
      this.closeModal();
      this.showReplaceCartModal = true;
    } else {
      this.closeModal();
    }
  }

  confirmReplaceCart(): void {
    if (this.pendingAddItem && this.restaurant) {
      this.cartService.replaceCartAndAdd(
        this.pendingAddItem.item,
        this.restaurant.id,
        this.restaurant.name,
        this.pendingAddItem.qty,
        this.pendingAddItem.variant,
        this.pendingAddItem.addons
      );
      this.showReplaceCartModal = false;
      this.pendingAddItem = undefined;
    }
  }
}
