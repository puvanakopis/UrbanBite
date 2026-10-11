import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RestaurantService } from '../../../services/restaurant.service';
import { MenuService } from '../../../services/menu.service';
import { Restaurant, MenuCategory, MenuItem } from '../../../models/restaurant.models';

@Component({
  selector: 'app-restaurant-menu',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="bg-[#090909] min-h-[90vh] py-12 sm:py-16 text-neutral-200">
      <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <!-- Customer-Style Page Header -->
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-4 border-b border-[#242424]">
          <div>
            <span class="text-xs font-bold uppercase tracking-[2.5px] text-gold mb-2 block">
              CHEF & MANAGER CATALOG
            </span>
            <div class="flex items-center gap-3">
              <h1 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Menu Management
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
              (click)="openCategoryModal()" 
              class="px-4 py-2 border border-neutral-700 hover:border-white text-neutral-300 hover:text-white rounded text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2">
              <i class="fa-solid fa-folder-plus text-gold"></i>
              <span>Categories ({{ categories.length }})</span>
            </button>

            <button 
              (click)="openNewItemModal()" 
              class="px-5 py-2.5 bg-gold hover:bg-gold-light text-black font-extrabold text-xs uppercase tracking-wider rounded transition-all cursor-pointer shadow-md flex items-center gap-2">
              <i class="fa-solid fa-plus"></i>
              <span>Add New Dish</span>
            </button>
          </div>
        </div>

        <!-- Filter & Search Toolbar (Customer Style) -->
        <div class="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-6">
          <!-- Dropdowns Group: Category + Status (Activate / Block) -->
          <div class="flex flex-wrap items-center gap-3">
            <!-- Category Dropdown Selector -->
            <div class="relative min-w-[200px] sm:w-56">
              <div class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold text-xs pointer-events-none">
                <i class="fa-solid fa-layer-group"></i>
              </div>
              <select 
                [(ngModel)]="selectedCategoryFilter" 
                class="w-full pl-9 pr-9 py-2 bg-[#141414] border border-[#242424] rounded text-xs text-white focus:outline-none focus:border-gold transition-colors appearance-none cursor-pointer font-bold tracking-wider uppercase">
                <option [ngValue]="null" class="bg-[#141414] text-white">All Categories ({{ items.length }})</option>
                <option *ngFor="let cat of categories" [ngValue]="cat.id" class="bg-[#141414] text-white">
                  {{ cat.name }} ({{ getCategoryItemsCount(cat.id) }})
                </option>
              </select>
              <div class="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-[10px] pointer-events-none">
                <i class="fa-solid fa-chevron-down"></i>
              </div>
            </div>

            <!-- Status Dropdown Selector (Active / Blocked) -->
            <div class="relative min-w-[180px] sm:w-52">
              <div class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold text-xs pointer-events-none">
                <i class="fa-solid fa-filter"></i>
              </div>
              <select 
                [(ngModel)]="selectedStatusFilter" 
                class="w-full pl-9 pr-9 py-2 bg-[#141414] border border-[#242424] rounded text-xs text-white focus:outline-none focus:border-gold transition-colors appearance-none cursor-pointer font-bold tracking-wider uppercase">
                <option value="ALL" class="bg-[#141414] text-white">All Status ({{ items.length }})</option>
                <option value="ACTIVE" class="bg-[#141414] text-emerald-400 font-bold">Active ({{ activeCount }})</option>
                <option value="BLOCKED" class="bg-[#141414] text-rose-400 font-bold">Blocked ({{ blockedCount }})</option>
              </select>
              <div class="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-[10px] pointer-events-none">
                <i class="fa-solid fa-chevron-down"></i>
              </div>
            </div>

            <span class="hidden lg:inline-flex items-center px-2.5 py-1.5 text-[11px] font-bold text-neutral-400 bg-[#141414] border border-[#242424] rounded">
              Showing {{ filteredItems.length }} of {{ items.length }}
            </span>
          </div>

          <!-- Search Bar -->
          <div class="relative min-w-[260px] md:w-80">
            <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 text-xs"></i>
            <input 
              type="text" 
              [(ngModel)]="searchDish" 
              placeholder="Search dishes by name..." 
              class="w-full pl-9 pr-8 py-2 bg-[#141414] border border-[#242424] rounded text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-gold transition-colors" />
            <button *ngIf="searchDish" 
                    (click)="searchDish = ''" 
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white text-xs">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="bg-[#141414] border border-[#242424] rounded p-20 text-center">
          <div class="w-10 h-10 border-2 border-neutral-700 border-t-gold rounded-full animate-spin mx-auto mb-4"></div>
          <h3 class="text-base font-bold text-white mb-1">Loading Menu Dishes</h3>
          <p class="text-xs text-neutral-400">Retrieving kitchen catalog items and categories...</p>
        </div>

        <!-- Empty State (Same as Orders Component) -->
        <div *ngIf="!loading && filteredItems.length === 0" 
             class="bg-[#141414] border border-[#242424] rounded p-16 text-center text-neutral-500 text-xs shadow-xl">
          <div class="w-16 h-16 rounded bg-[#1b1b1b] border border-[#282828] mx-auto flex items-center justify-center text-gold/80 text-2xl mb-4">
            <i class="fa-solid fa-utensils"></i>
          </div>
          <p class="font-bold text-white text-base">No dishes found</p>
          <p class="text-xs text-neutral-400 mt-1 mb-4">No dishes matching your current filter criteria or search query.</p>
          <div class="flex items-center justify-center gap-3">
            <button (click)="resetFilters()" 
                    class="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-extrabold text-xs uppercase tracking-wider rounded transition-all cursor-pointer shadow-md inline-flex items-center gap-2">
              <i class="fa-solid fa-arrows-rotate"></i> Reset Filters
            </button>
            <button (click)="openNewItemModal()" 
                    class="px-5 py-2.5 bg-gold hover:bg-gold-light text-black font-extrabold text-xs uppercase tracking-wider rounded transition-all cursor-pointer shadow-md inline-flex items-center gap-2">
              <i class="fa-solid fa-plus"></i> Add New Dish
            </button>
          </div>
        </div>

        <!-- Dishes Table Card -->
        <div *ngIf="!loading && filteredItems.length > 0" class="bg-[#141414] border border-[#242424] rounded overflow-hidden shadow-xl">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs text-neutral-300">
              <thead class="bg-[#181818] border-b border-[#242424] text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                <tr>
                  <th class="p-4 sm:p-5">Dish Details</th>
                  <th class="p-4 sm:p-5">Category</th>
                  <th class="p-4 sm:p-5">Price</th>
                  <th class="p-4 sm:p-5">Dietary</th>
                  <th class="p-4 sm:p-5">Status</th>
                  <th class="p-4 sm:p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#1e1e1e]">
                <tr *ngFor="let it of filteredItems" class="hover:bg-[#181818]/60 transition-colors">
                  <td class="p-4 sm:p-5">
                    <div class="flex items-center gap-3.5">
                      <img [src]="it.imageUrl || '/images/signature-steak.jpg'" 
                           class="w-12 h-12 rounded object-cover bg-neutral-900 border border-[#242424] shrink-0" />
                      <div class="max-w-md">
                        <strong class="text-white block text-sm">{{ it.name }}</strong>
                        <p class="text-neutral-400 text-xs line-clamp-1 mt-0.5">{{ it.description || 'No description provided' }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="p-4 sm:p-5">
                    <span class="px-2.5 py-1 rounded bg-[#1c1c1c] border border-[#2a2a2a] text-neutral-300 font-semibold text-[11px]">
                      {{ it.category?.name || 'Standard' }}
                    </span>
                  </td>
                  <td class="p-4 sm:p-5 font-bold text-white text-sm font-serif">
                    &#36;{{ it.price | number:'1.2-2' }}
                  </td>
                  <td class="p-4 sm:p-5">
                    <div class="flex gap-1.5">
                      <span *ngIf="it.isVegetarian" class="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950/60 border border-emerald-500/40 text-emerald-400">VEG</span>
                      <span *ngIf="it.isSpicy" class="px-2.5 py-0.5 rounded text-[10px] font-bold bg-rose-950/60 border border-rose-500/40 text-rose-400">SPICY</span>
                      <span *ngIf="!it.isVegetarian && !it.isSpicy" class="text-neutral-600 text-[11px]">-</span>
                    </div>
                  </td>
                  <td class="p-4 sm:p-5">
                    <!-- Status Dropdown (Activate / Block) -->
                    <div class="relative inline-block min-w-[120px]">
                      <select 
                        [ngModel]="it.isAvailable" 
                        (ngModelChange)="setItemAvailability(it, $event)"
                        class="w-full pl-3 pr-7 py-1.5 text-[10px] font-extrabold tracking-wider rounded border uppercase cursor-pointer appearance-none outline-none transition-all"
                        [ngClass]="it.isAvailable ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-400 hover:bg-emerald-950/80 focus:border-emerald-400' : 'bg-rose-950/60 border-rose-500/50 text-rose-400 hover:bg-rose-950/80 focus:border-rose-400'">
                        <option [ngValue]="true" class="bg-[#141414] text-emerald-400 font-bold">Active</option>
                        <option [ngValue]="false" class="bg-[#141414] text-rose-400 font-bold">Blocked</option>
                      </select>
                      <div class="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[8px]"
                           [ngClass]="it.isAvailable ? 'text-emerald-400' : 'text-rose-400'">
                        <i class="fa-solid fa-chevron-down"></i>
                      </div>
                    </div>
                  </td>
                  <td class="p-4 sm:p-5 text-right">
                    <div class="flex items-center justify-end gap-3">
                      <button (click)="openEditItemModal(it)" class="text-neutral-400 hover:text-white transition-colors cursor-pointer p-1.5" title="Edit Dish">
                        <i class="fa-regular fa-pen-to-square text-sm"></i>
                      </button>
                      <button (click)="deleteMenuItem(it.id)" class="text-rose-400 hover:text-rose-300 transition-colors cursor-pointer p-1.5" title="Delete Dish">
                        <i class="fa-regular fa-trash-can text-sm"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- ADD / EDIT DISH MODAL (Customer Style) -->
        <div *ngIf="showItemModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div class="bg-[#141414] border border-[#242424] rounded w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div class="p-5 border-b border-[#242424] flex justify-between items-center">
              <div>
                <span class="text-xs font-bold uppercase tracking-[2px] text-gold block">DISH BUILDER</span>
                <h3 class="text-lg font-bold text-white">{{ isEditing ? 'Edit Menu Dish' : 'Add New Menu Dish' }}</h3>
              </div>
              <button (click)="showItemModal = false" class="text-neutral-500 hover:text-white cursor-pointer"><i class="fa-solid fa-xmark"></i></button>
            </div>
            
            <form (submit)="saveMenuItem($event)" class="flex-1 overflow-y-auto">
              <div class="p-6 space-y-4">
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Dish Name *</label>
                  <input type="text" [(ngModel)]="currentItem.name" name="name" required class="w-full px-4 py-2.5 bg-[#0d0d0d] border border-[#242424] rounded text-white text-xs outline-none focus:border-gold transition-colors placeholder:text-neutral-600" placeholder="e.g. Truffle Wild Mushroom Risotto" />
                </div>

                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Description</label>
                  <textarea [(ngModel)]="currentItem.description" name="description" class="w-full px-4 py-2.5 bg-[#0d0d0d] border border-[#242424] rounded text-white text-xs outline-none focus:border-gold transition-colors min-h-[85px] placeholder:text-neutral-600" placeholder="Arborio rice, aged parmesan, porcini broth, shaved black truffles"></textarea>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Price ($) *</label>
                    <input type="number" step="0.5" [(ngModel)]="currentItem.price" name="price" required class="w-full px-4 py-2.5 bg-[#0d0d0d] border border-[#242424] rounded text-white text-xs outline-none focus:border-gold transition-colors placeholder:text-neutral-600" placeholder="22.50" />
                  </div>
                  <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Category</label>
                    <select [(ngModel)]="itemCategoryId" name="category" class="w-full px-4 py-2.5 bg-[#0d0d0d] border border-[#242424] rounded text-white text-xs outline-none focus:border-gold transition-colors">
                      <option *ngFor="let c of categories" [value]="c.id">{{ c.name }}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Dish Photo URL</label>
                  <input type="text" [(ngModel)]="currentItem.imageUrl" name="imageUrl" class="w-full px-4 py-2.5 bg-[#0d0d0d] border border-[#242424] rounded text-white text-xs outline-none focus:border-gold transition-colors placeholder:text-neutral-600" placeholder="https://images.unsplash.com/..." />
                </div>

                <!-- Dietary Checkboxes -->
                <div class="flex items-center gap-6 pt-2">
                  <label class="flex items-center gap-2.5 text-xs text-neutral-300 cursor-pointer">
                    <input type="checkbox" [(ngModel)]="currentItem.isVegetarian" name="isVegetarian" class="rounded bg-[#0d0d0d] border-neutral-700 text-gold" />
                    <span>Vegetarian</span>
                  </label>
                  <label class="flex items-center gap-2.5 text-xs text-neutral-300 cursor-pointer">
                    <input type="checkbox" [(ngModel)]="currentItem.isSpicy" name="isSpicy" class="rounded bg-[#0d0d0d] border-neutral-700 text-gold" />
                    <span>Spicy</span>
                  </label>
                  <label class="flex items-center gap-2.5 text-xs text-neutral-300 cursor-pointer">
                    <input type="checkbox" [(ngModel)]="currentItem.isAvailable" name="isAvailable" class="rounded bg-[#0d0d0d] border-neutral-700 text-gold" />
                    <span>In Stock (Available)</span>
                  </label>
                </div>
              </div>

              <div class="p-5 border-t border-[#242424] flex items-center justify-end gap-3">
                <button type="button" (click)="showItemModal = false" class="px-4 py-2.5 border border-neutral-700 hover:border-neutral-500 text-neutral-300 font-bold text-xs uppercase tracking-wider rounded transition-colors cursor-pointer">
                  Cancel
                </button>
                <button type="submit" class="px-6 py-2.5 bg-gold hover:bg-gold-light text-black font-extrabold text-xs uppercase tracking-wider rounded transition-all cursor-pointer shadow-md">
                  {{ isEditing ? 'UPDATE DISH' : 'CREATE DISH' }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- MANAGE CATEGORIES MODAL (Customer Style) -->
        <div *ngIf="showCategoryModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div class="bg-[#141414] border border-[#242424] rounded w-full max-w-md shadow-2xl overflow-hidden">
            <div class="p-5 border-b border-[#242424] flex justify-between items-center">
              <div>
                <span class="text-xs font-bold uppercase tracking-[2px] text-gold block">CATALOG TAXONOMY</span>
                <h3 class="text-lg font-bold text-white">Manage Menu Categories</h3>
              </div>
              <button (click)="showCategoryModal = false" class="text-neutral-500 hover:text-white cursor-pointer"><i class="fa-solid fa-xmark"></i></button>
            </div>

            <div class="p-6 space-y-5">
              <!-- Add category form -->
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">New Category Name</label>
                <div class="flex gap-2">
                  <input type="text" [(ngModel)]="newCategoryName" placeholder="e.g. Appetizers, Mains, Drinks" class="flex-1 px-4 py-2.5 bg-[#0d0d0d] border border-[#242424] rounded text-white text-xs outline-none focus:border-gold placeholder:text-neutral-600" />
                  <button (click)="createCategory()" class="px-5 py-2.5 bg-gold text-black font-extrabold text-xs uppercase tracking-wider rounded hover:bg-gold-light cursor-pointer whitespace-nowrap shadow-md" [disabled]="!newCategoryName">
                    Add
                  </button>
                </div>
              </div>

              <!-- Existing categories list -->
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Active Categories</label>
                <div class="space-y-2 max-h-60 overflow-y-auto">
                  <div *ngFor="let cat of categories" class="flex justify-between items-center p-3 bg-[#0d0d0d] border border-[#242424] rounded text-xs">
                    <span class="text-white font-semibold">{{ cat.name }}</span>
                    <button (click)="deleteCategory(cat.id)" class="text-rose-400 hover:text-rose-300 cursor-pointer p-1" title="Delete Category">
                      <i class="fa-regular fa-trash-can"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="p-4 border-t border-[#242424] flex justify-end">
              <button (click)="showCategoryModal = false" class="px-4 py-2 border border-neutral-700 hover:border-neutral-500 text-neutral-300 font-bold text-xs uppercase tracking-wider rounded transition-colors cursor-pointer">
                Close
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  `
})
export class RestaurantMenuComponent implements OnInit {
  restaurant: Restaurant | null = null;
  items: MenuItem[] = [];
  categories: MenuCategory[] = [];
  loading: boolean = true;

  selectedCategoryFilter: number | null = null;
  selectedStatusFilter: 'ALL' | 'ACTIVE' | 'BLOCKED' = 'ALL';
  searchDish: string = '';

  // Item Modal state
  showItemModal: boolean = false;
  isEditing: boolean = false;
  itemCategoryId?: number;
  currentItem: Partial<MenuItem> = {
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    isVegetarian: false,
    isSpicy: false,
    isAvailable: true
  };

  // Category Modal state
  showCategoryModal: boolean = false;
  newCategoryName: string = '';

  constructor(
    private restaurantService: RestaurantService,
    private menuService: MenuService
  ) {}

  ngOnInit(): void {
    this.loadRestaurant();
  }

  loadRestaurant(): void {
    this.loading = true;
    this.restaurantService.getMyRestaurant().subscribe({
      next: res => {
        this.loading = false;
        if (res.success && res.data) {
          this.restaurant = res.data;
          this.loadMenu(res.data.id);
        }
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  loadMenu(restaurantId: number): void {
    this.menuService.getCategories(restaurantId).subscribe({
      next: res => {
        if (res.success && res.data) {
          this.categories = res.data;
          if (this.categories.length > 0 && !this.itemCategoryId) {
            this.itemCategoryId = this.categories[0].id;
          }
        }
      }
    });

    this.menuService.getItems(restaurantId, false).subscribe({
      next: res => {
        if (res.success && res.data) {
          this.items = res.data;
        }
      }
    });
  }

  get activeCount(): number {
    return this.items.filter(i => i.isAvailable).length;
  }

  get blockedCount(): number {
    return this.items.filter(i => !i.isAvailable).length;
  }

  get filteredItems(): MenuItem[] {
    return this.items.filter(it => {
      const matchesCategory = this.selectedCategoryFilter === null || it.category?.id === this.selectedCategoryFilter;
      const matchesStatus = this.selectedStatusFilter === 'ALL' ||
        (this.selectedStatusFilter === 'ACTIVE' && it.isAvailable) ||
        (this.selectedStatusFilter === 'BLOCKED' && !it.isAvailable);
      const matchesSearch = !this.searchDish || it.name.toLowerCase().includes(this.searchDish.toLowerCase());
      return matchesCategory && matchesStatus && matchesSearch;
    });
  }

  getCategoryItemsCount(catId: number): number {
    return this.items.filter(it => it.category?.id === catId).length;
  }

  toggleItemAvailability(item: MenuItem): void {
    this.menuService.toggleAvailability(item.id).subscribe({
      next: res => {
        if (res.success && res.data) {
          item.isAvailable = res.data.isAvailable;
        }
      }
    });
  }

  setItemAvailability(item: MenuItem, desiredAvailability: boolean): void {
    if (item.isAvailable === desiredAvailability) return;
    this.menuService.toggleAvailability(item.id).subscribe({
      next: res => {
        if (res.success && res.data) {
          item.isAvailable = res.data.isAvailable;
        }
      }
    });
  }

  resetFilters(): void {
    this.selectedCategoryFilter = null;
    this.selectedStatusFilter = 'ALL';
    this.searchDish = '';
  }

  openNewItemModal(): void {
    this.isEditing = false;
    this.currentItem = {
      name: '',
      description: '',
      price: 0,
      imageUrl: '',
      isVegetarian: false,
      isSpicy: false,
      isAvailable: true
    };
    if (this.categories.length > 0) {
      this.itemCategoryId = this.categories[0].id;
    }
    this.showItemModal = true;
  }

  openEditItemModal(item: MenuItem): void {
    this.isEditing = true;
    this.currentItem = { ...item };
    this.itemCategoryId = item.category?.id;
    this.showItemModal = true;
  }

  saveMenuItem(event: Event): void {
    event.preventDefault();
    if (!this.restaurant || !this.currentItem.name) return;

    if (this.isEditing && this.currentItem.id) {
      this.menuService.updateItem(this.currentItem.id, this.currentItem).subscribe({
        next: res => {
          if (res.success) {
            this.showItemModal = false;
            this.loadMenu(this.restaurant!.id);
          }
        }
      });
    } else {
      this.menuService.createItem(this.restaurant.id, this.currentItem, this.itemCategoryId).subscribe({
        next: res => {
          if (res.success) {
            this.showItemModal = false;
            this.loadMenu(this.restaurant!.id);
          }
        }
      });
    }
  }

  deleteMenuItem(itemId: number): void {
    if (confirm('Are you sure you want to remove this dish from the menu?')) {
      this.menuService.deleteItem(itemId).subscribe({
        next: () => {
          if (this.restaurant) this.loadMenu(this.restaurant.id);
        }
      });
    }
  }

  openCategoryModal(): void {
    this.newCategoryName = '';
    this.showCategoryModal = true;
  }

  createCategory(): void {
    if (!this.restaurant || !this.newCategoryName.trim()) return;
    this.menuService.createCategory(this.restaurant.id, this.newCategoryName.trim()).subscribe({
      next: res => {
        if (res.success) {
          this.newCategoryName = '';
          this.loadMenu(this.restaurant!.id);
        }
      }
    });
  }

  deleteCategory(catId: number): void {
    if (confirm('Are you sure you want to remove this category?')) {
      this.menuService.deleteCategory(catId).subscribe({
        next: () => {
          if (this.restaurant) this.loadMenu(this.restaurant.id);
        }
      });
    }
  }
}
