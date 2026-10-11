import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/customer-portal/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/customer-portal/about/about.component').then(m => m.AboutComponent)
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/customer-portal/contact/contact.component').then(m => m.ContactComponent)
  },
  {
    path: 'restaurants',
    loadComponent: () => import('./pages/customer-portal/restaurants/restaurants.component').then(m => m.RestaurantsComponent)
  },
  {
    path: 'restaurants/:id',
    loadComponent: () => import('./pages/customer-portal/restaurant-detail/restaurant-detail.component').then(m => m.RestaurantDetailComponent)
  },
  {
    path: 'cart',
    loadComponent: () => import('./pages/customer-portal/cart/cart.component').then(m => m.CartComponent)
  },
  {
    path: 'order',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/customer-portal/orders/orders.component').then(m => m.OrdersComponent)
  },
  {
    path: 'orders',
    redirectTo: 'order',
    pathMatch: 'full'
  },
  {
    path: 'orders/:orderNumber',
    loadComponent: () => import('./pages/customer-portal/order-tracking/order-tracking.component').then(m => m.OrderTrackingComponent)
  },
  // Customer path aliases for backward and direct compatibility
  {
    path: 'customer/contact',
    redirectTo: 'contact',
    pathMatch: 'full'
  },
  {
    path: 'customer/orders',
    redirectTo: 'order',
    pathMatch: 'full'
  },
  {
    path: 'customer/restaurants',
    redirectTo: 'restaurants',
    pathMatch: 'full'
  },
  {
    path: 'customer/cart',
    redirectTo: 'cart',
    pathMatch: 'full'
  },
  {
    path: 'customer/about',
    redirectTo: 'about',
    pathMatch: 'full'
  },
  {
    path: 'account',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/customer-portal/account/account.component').then(m => m.AccountComponent)
  },
  {
    path: 'account/orders',
    redirectTo: 'order',
    pathMatch: 'full'
  },
  {
    path: 'settings',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/customer-portal/settings/settings.component').then(m => m.SettingsComponent)
  },
  // Restaurant Portal Routes
  {
    path: 'restaurant-portal',
    redirectTo: 'restaurant-portal/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'restaurant-portal/dashboard',
    canActivate: [authGuard, roleGuard(['ROLE_RESTAURANT_OWNER', 'ROLE_ADMIN'])],
    loadComponent: () => import('./pages/restaurant-portal/dashboard/restaurant-dashboard.component').then(m => m.RestaurantDashboardComponent)
  },
  {
    path: 'restaurant-portal/orders',
    canActivate: [authGuard, roleGuard(['ROLE_RESTAURANT_OWNER', 'ROLE_ADMIN'])],
    loadComponent: () => import('./pages/restaurant-portal/orders/restaurant-orders.component').then(m => m.RestaurantOrdersComponent)
  },
  {
    path: 'restaurant-portal/menu',
    canActivate: [authGuard, roleGuard(['ROLE_RESTAURANT_OWNER', 'ROLE_ADMIN'])],
    loadComponent: () => import('./pages/restaurant-portal/menu/restaurant-menu.component').then(m => m.RestaurantMenuComponent)
  },
  {
    path: 'restaurant-portal/settings',
    canActivate: [authGuard, roleGuard(['ROLE_RESTAURANT_OWNER', 'ROLE_ADMIN'])],
    loadComponent: () => import('./pages/restaurant-portal/settings/restaurant-settings.component').then(m => m.RestaurantSettingsComponent)
  },
  {
    path: 'restaurant-portal/profile',
    redirectTo: 'restaurant-portal/settings',
    pathMatch: 'full'
  },

  // Backward-compatible aliases for Restaurant Portal
  {
    path: 'restaurant-partner',
    redirectTo: 'restaurant-portal/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'restaurant-partner/dashboard',
    redirectTo: 'restaurant-portal/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'restaurant-partner/orders',
    redirectTo: 'restaurant-portal/orders',
    pathMatch: 'full'
  },
  {
    path: 'restaurant-partner/menu',
    redirectTo: 'restaurant-portal/menu',
    pathMatch: 'full'
  },
  {
    path: 'restaurant-partner/settings',
    redirectTo: 'restaurant-portal/settings',
    pathMatch: 'full'
  },
  {
    path: 'restaurant-partner/profile',
    redirectTo: 'restaurant-portal/settings',
    pathMatch: 'full'
  },
  {
    path: 'restaurant',
    redirectTo: 'restaurant-portal/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'restaurant/dashboard',
    redirectTo: 'restaurant-portal/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'restaurant/orders',
    redirectTo: 'restaurant-portal/orders',
    pathMatch: 'full'
  },
  {
    path: 'restaurant/menu',
    redirectTo: 'restaurant-portal/menu',
    pathMatch: 'full'
  },
  {
    path: 'restaurant/settings',
    redirectTo: 'restaurant-portal/settings',
    pathMatch: 'full'
  },
  {
    path: 'restaurant/profile',
    redirectTo: 'restaurant-portal/settings',
    pathMatch: 'full'
  },

  // Delivery Portal Routes
  {
    path: 'delivery-portal',
    redirectTo: 'delivery-portal/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'delivery-portal/dashboard',
    canActivate: [authGuard, roleGuard(['ROLE_DELIVERY_PARTNER', 'ROLE_ADMIN'])],
    loadComponent: () => import('./pages/delivery-portal/dashboard/delivery-dashboard.component').then(m => m.DeliveryDashboardComponent)
  },
  {
    path: 'delivery-portal/orders',
    canActivate: [authGuard, roleGuard(['ROLE_DELIVERY_PARTNER', 'ROLE_ADMIN'])],
    loadComponent: () => import('./pages/delivery-portal/orders/delivery-orders.component').then(m => m.DeliveryOrdersComponent)
  },
  {
    path: 'delivery-portal/deliveries',
    redirectTo: 'delivery-portal/orders',
    pathMatch: 'full'
  },
  {
    path: 'delivery-portal/requests',
    redirectTo: 'delivery-portal/orders',
    pathMatch: 'full'
  },
  {
    path: 'delivery-portal/active',
    redirectTo: 'delivery-portal/orders',
    pathMatch: 'full'
  },
  {
    path: 'delivery-portal/history',
    redirectTo: 'delivery-portal/orders',
    pathMatch: 'full'
  },
  {
    path: 'delivery-portal/earnings',
    canActivate: [authGuard, roleGuard(['ROLE_DELIVERY_PARTNER', 'ROLE_ADMIN'])],
    loadComponent: () => import('./pages/delivery-portal/earnings/delivery-earnings.component').then(m => m.DeliveryEarningsComponent)
  },
  {
    path: 'delivery-portal/settings',
    canActivate: [authGuard, roleGuard(['ROLE_DELIVERY_PARTNER', 'ROLE_ADMIN'])],
    loadComponent: () => import('./pages/delivery-portal/settings/delivery-settings.component').then(m => m.DeliverySettingsComponent)
  },
  {
    path: 'delivery-portal/profile',
    redirectTo: 'delivery-portal/settings',
    pathMatch: 'full'
  },

  // Backward-compatible aliases for Delivery Portal
  {
    path: 'delivery-partner',
    redirectTo: 'delivery-portal/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'delivery-partner/dashboard',
    redirectTo: 'delivery-portal/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'delivery-partner/orders',
    redirectTo: 'delivery-portal/orders',
    pathMatch: 'full'
  },
  {
    path: 'delivery-partner/deliveries',
    redirectTo: 'delivery-portal/orders',
    pathMatch: 'full'
  },
  {
    path: 'delivery-partner/requests',
    redirectTo: 'delivery-portal/orders',
    pathMatch: 'full'
  },
  {
    path: 'delivery-partner/active',
    redirectTo: 'delivery-portal/orders',
    pathMatch: 'full'
  },
  {
    path: 'delivery-partner/history',
    redirectTo: 'delivery-portal/orders',
    pathMatch: 'full'
  },
  {
    path: 'delivery-partner/earnings',
    redirectTo: 'delivery-portal/earnings',
    pathMatch: 'full'
  },
  {
    path: 'delivery-partner/settings',
    redirectTo: 'delivery-portal/settings',
    pathMatch: 'full'
  },
  {
    path: 'delivery-partner/profile',
    redirectTo: 'delivery-portal/settings',
    pathMatch: 'full'
  },
  {
    path: 'delivery',
    redirectTo: 'delivery-portal/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'delivery/dashboard',
    redirectTo: 'delivery-portal/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'delivery/orders',
    redirectTo: 'delivery-portal/orders',
    pathMatch: 'full'
  },
  {
    path: 'delivery/deliveries',
    redirectTo: 'delivery-portal/orders',
    pathMatch: 'full'
  },
  {
    path: 'delivery/requests',
    redirectTo: 'delivery-portal/orders',
    pathMatch: 'full'
  },
  {
    path: 'delivery/active',
    redirectTo: 'delivery-portal/orders',
    pathMatch: 'full'
  },
  {
    path: 'delivery/history',
    redirectTo: 'delivery-portal/orders',
    pathMatch: 'full'
  },
  {
    path: 'delivery/earnings',
    redirectTo: 'delivery-portal/earnings',
    pathMatch: 'full'
  },
  {
    path: 'delivery/settings',
    redirectTo: 'delivery-portal/settings',
    pathMatch: 'full'
  },
  {
    path: 'delivery/profile',
    redirectTo: 'delivery-portal/settings',
    pathMatch: 'full'
  },

  // Admin Portal Routes
  {
    path: 'admin-portal',
    redirectTo: 'admin-portal/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'admin-portal/dashboard',
    canActivate: [authGuard, roleGuard(['ROLE_ADMIN'])],
    loadComponent: () => import('./pages/admin-portal/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
  },
  {
    path: 'admin-portal/restaurants',
    canActivate: [authGuard, roleGuard(['ROLE_ADMIN'])],
    loadComponent: () => import('./pages/admin-portal/restaurants/admin-restaurants.component').then(m => m.AdminRestaurantsComponent)
  },
  {
    path: 'admin-portal/customers',
    canActivate: [authGuard, roleGuard(['ROLE_ADMIN'])],
    loadComponent: () => import('./pages/admin-portal/customers/admin-customers.component').then(m => m.AdminCustomersComponent)
  },
  {
    path: 'admin-portal/users',
    redirectTo: 'admin-portal/customers',
    pathMatch: 'full'
  },
  {
    path: 'admin-portal/orders',
    canActivate: [authGuard, roleGuard(['ROLE_ADMIN'])],
    loadComponent: () => import('./pages/admin-portal/orders/admin-orders.component').then(m => m.AdminOrdersComponent)
  },
  {
    path: 'admin-portal/profile',
    canActivate: [authGuard, roleGuard(['ROLE_ADMIN'])],
    loadComponent: () => import('./pages/admin-portal/profile/admin-profile.component').then(m => m.AdminProfileComponent)
  },

  // Backward-compatible aliases for Admin Portal
  {
    path: 'admin',
    redirectTo: 'admin-portal/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'admin/dashboard',
    redirectTo: 'admin-portal/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'admin/restaurants',
    redirectTo: 'admin-portal/restaurants',
    pathMatch: 'full'
  },
  {
    path: 'admin/customers',
    redirectTo: 'admin-portal/customers',
    pathMatch: 'full'
  },
  {
    path: 'admin/users',
    redirectTo: 'admin-portal/customers',
    pathMatch: 'full'
  },
  {
    path: 'admin/orders',
    redirectTo: 'admin-portal/orders',
    pathMatch: 'full'
  },
  {
    path: 'admin/profile',
    redirectTo: 'admin-portal/profile',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'verify-otp',
    loadComponent: () => import('./pages/auth/verify-otp/verify-otp.component').then(m => m.VerifyOtpComponent)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./pages/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
