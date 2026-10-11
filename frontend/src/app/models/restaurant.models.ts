export interface Restaurant {
  id: number;
  name: string;
  slug: string;
  tagline?: string;
  description?: string;
  cuisine: string;
  address: string;
  city: string;
  phone?: string;
  email?: string;
  rating: number;
  totalReviews: number;
  imageUrl: string;
  logoUrl?: string;
  isOpen: boolean;
  openingHours?: string;
  deliveryFee: number;
  minOrderAmount: number;
  avgDeliveryTimeMinutes: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
}

export interface MenuCategory {
  id: number;
  name: string;
  displayOrder: number;
  active: boolean;
}

export interface MenuItemVariant {
  id?: number;
  name: string;
  priceAdjustment: number;
}

export interface MenuItemAddon {
  id?: number;
  name: string;
  price: number;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isVegetarian: boolean;
  isSpicy: boolean;
  isAvailable: boolean;
  category?: MenuCategory;
  variants?: MenuItemVariant[];
  addons?: MenuItemAddon[];
}
