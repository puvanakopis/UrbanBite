import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../models/order.models';
import { MenuItem, MenuItemAddon, MenuItemVariant } from '../models/restaurant.models';
import { ApiResponse } from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly CART_KEY = 'urbanbite_cart';

  private cartItemsSubject = new BehaviorSubject<CartItem[]>(this.getStoredCart());
  public cartItems$ = this.cartItemsSubject.asObservable();

  constructor(private http: HttpClient) {
    // Clean up any legacy stored coupon
    localStorage.removeItem('urbanbite_coupon');
  }

  public get items(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  public get restaurantId(): number | null {
    return this.items.length > 0 ? this.items[0].restaurantId : null;
  }

  public get restaurantName(): string | null {
    return this.items.length > 0 ? this.items[0].restaurantName : null;
  }

  public isDifferentRestaurant(restaurantId: number): boolean {
    const currentId = this.restaurantId;
    return currentId !== null && currentId !== restaurantId;
  }

  public addToCart(
    item: MenuItem,
    restaurantId: number,
    restaurantName: string,
    quantity: number = 1,
    variant?: MenuItemVariant,
    addons: MenuItemAddon[] = []
  ): boolean {
    // If different restaurant, return false to trigger user confirmation
    if (this.isDifferentRestaurant(restaurantId)) {
      return false;
    }

    let unitPrice = item.price;
    if (variant && variant.priceAdjustment) {
      unitPrice += Number(variant.priceAdjustment);
    }
    if (addons && addons.length > 0) {
      const addonsSum = addons.reduce((sum, a) => sum + Number(a.price), 0);
      unitPrice += addonsSum;
    }

    const currentItems = [...this.items];
    const existingIndex = currentItems.findIndex(ci => 
      ci.menuItem.id === item.id &&
      ci.selectedVariant?.name === variant?.name &&
      this.addonsMatch(ci.selectedAddons, addons)
    );

    if (existingIndex > -1) {
      currentItems[existingIndex].quantity += quantity;
      currentItems[existingIndex].itemTotal = currentItems[existingIndex].quantity * currentItems[existingIndex].unitPrice;
    } else {
      const cartItem: CartItem = {
        menuItem: item,
        restaurantId,
        restaurantName,
        quantity,
        selectedVariant: variant,
        selectedAddons: addons,
        unitPrice,
        itemTotal: unitPrice * quantity
      };
      currentItems.push(cartItem);
    }

    this.updateCart(currentItems);
    return true;
  }

  public replaceCartAndAdd(
    item: MenuItem,
    restaurantId: number,
    restaurantName: string,
    quantity: number = 1,
    variant?: MenuItemVariant,
    addons: MenuItemAddon[] = []
  ): void {
    this.clearCart();
    this.addToCart(item, restaurantId, restaurantName, quantity, variant, addons);
  }

  public updateQuantity(index: number, quantity: number): void {
    const currentItems = [...this.items];
    if (index >= 0 && index < currentItems.length) {
      if (quantity <= 0) {
        currentItems.splice(index, 1);
      } else {
        currentItems[index].quantity = quantity;
        currentItems[index].itemTotal = quantity * currentItems[index].unitPrice;
      }
      this.updateCart(currentItems);
    }
  }

  public removeItem(index: number): void {
    const currentItems = [...this.items];
    if (index >= 0 && index < currentItems.length) {
      currentItems.splice(index, 1);
      this.updateCart(currentItems);
    }
  }

  public clearCart(): void {
    this.updateCart([]);
  }

  public getSubtotal(): number {
    return this.items.reduce((sum, item) => sum + item.itemTotal, 0);
  }

  public getDeliveryFee(): number {
    return this.items.length > 0 ? 3.50 : 0;
  }

  public getTax(): number {
    const subtotal = this.getSubtotal();
    return subtotal * 0.05;
  }

  public getDiscountAmount(): number {
    return 0;
  }

  public getTotal(): number {
    const subtotal = this.getSubtotal();
    const delivery = this.getDeliveryFee();
    const tax = this.getTax();
    return Math.max(0, subtotal + delivery + tax);
  }

  private updateCart(items: CartItem[]): void {
    localStorage.setItem(this.CART_KEY, JSON.stringify(items));
    this.cartItemsSubject.next(items);
  }

  private getStoredCart(): CartItem[] {
    const raw = localStorage.getItem(this.CART_KEY);
    if (!raw) return [];
    try {
      const items: CartItem[] = JSON.parse(raw);
      // Clean out any previously injected mock items
      if (Array.isArray(items) && items.some(i => i.menuItem?.id === 101 && i.restaurantName === 'Osteria Del Sole Atelier')) {
        localStorage.removeItem(this.CART_KEY);
        return [];
      }
      return items;
    } catch {
      return [];
    }
  }

  private addonsMatch(a1: MenuItemAddon[] = [], a2: MenuItemAddon[] = []): boolean {
    if (a1.length !== a2.length) return false;
    const s1 = a1.map(a => a.name).sort().join(',');
    const s2 = a2.map(a => a.name).sort().join(',');
    return s1 === s2;
  }
}
