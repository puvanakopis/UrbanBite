import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CustomerNavbarComponent } from './components/customer-navbar/customer-navbar.component';
import { RestaurantNavbarComponent } from './components/restaurant-navbar/restaurant-navbar.component';
import { DeliveryNavbarComponent } from './components/delivery-navbar/delivery-navbar.component';
import { AdminNavbarComponent } from './components/admin-navbar/admin-navbar.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, CustomerNavbarComponent, RestaurantNavbarComponent, DeliveryNavbarComponent, AdminNavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'UrbanBite';
  isRestaurantRoute = false;
  isDeliveryRoute = false;
  isAdminRoute = false;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateRouteState(event.urlAfterRedirects || event.url);
    });
  }

  ngOnInit(): void {
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : this.router.url;
    this.updateRouteState(currentPath || this.router.url);
  }

  private updateRouteState(url: string): void {
    const path = (url || '').split('?')[0].split('#')[0];
    this.isRestaurantRoute = path.startsWith('/restaurant-portal') || path.startsWith('/restaurant-partner') || path === '/restaurant' || path.startsWith('/restaurant/');
    this.isDeliveryRoute = path.startsWith('/delivery-portal') || path.startsWith('/delivery-partner') || path === '/delivery' || path.startsWith('/delivery/');
    this.isAdminRoute = path.startsWith('/admin-portal') || path.startsWith('/admin');
  }
}
