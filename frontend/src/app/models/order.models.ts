import { Restaurant, MenuItem, MenuItemVariant, MenuItemAddon } from './restaurant.models';
import { User } from './auth.models';

export type OrderStatus =
  | 'PLACED'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'READY_FOR_PICKUP'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REJECTED';

export interface OrderItem {
  id?: number;
  menuItem?: MenuItem;
  itemName: string;
  unitPrice: number;
  quantity: number;
  variantName?: string;
  addonsSummary?: string;
  itemTotal: number;
}

export interface OrderStatusHistory {
  id?: number;
  status: OrderStatus;
  note?: string;
  updatedByRole?: string;
  timestamp: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  customer?: User;
  restaurant?: Restaurant;
  deliveryPartner?: User;
  status: OrderStatus;
  rejectionReason?: string;
  subtotal: number;
  discountAmount: number;
  deliveryFee: number;
  taxAmount: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  deliveryAddressText: string;
  customerNotes?: string;
  couponCode?: string;
  items: OrderItem[];
  statusHistory: OrderStatusHistory[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  menuItem: MenuItem;
  restaurantId: number;
  restaurantName: string;
  quantity: number;
  selectedVariant?: MenuItemVariant;
  selectedAddons: MenuItemAddon[];
  unitPrice: number;
  itemTotal: number;
}

export interface Address {
  id?: number;
  label: string;
  streetAddress: string;
  city?: string;
  postalCode?: string;
  phone?: string;
  deliveryInstructions?: string;
  isDefault?: boolean;
}

export interface Review {
  id: number;
  rating: number;
  comment: string;
  restaurantReply?: string;
  createdAt: string;
  customer?: { fullName: string };
}
