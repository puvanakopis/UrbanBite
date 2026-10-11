import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RestaurantService } from '../../../services/restaurant.service';
import { Restaurant } from '../../../models/restaurant.models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-[#090909]">
      <!-- HERO SECTION: 3-PANEL EDITORIAL CINEMATIC TRIPTYCH -->
      <section class="relative h-[540px] sm:h-[620px] lg:h-[700px] flex items-center justify-center overflow-hidden">
        
        <!-- 3-Column Photographic Grid -->
        <div class="absolute inset-0 grid grid-cols-1 md:grid-cols-3 h-full w-full">
          <!-- Panel 1: Dining Salon -->
          <div class="relative h-full w-full bg-cover bg-center" 
               style="background-image: url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80');">
          </div>
          <!-- Panel 2: Table Setting & Atmosphere -->
          <div class="hidden md:block relative h-full w-full bg-cover bg-center border-x border-black/40" 
               style="background-image: url('https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1200&q=80');">
          </div>
          <!-- Panel 3: Culinary & Bar Spread -->
          <div class="hidden md:block relative h-full w-full bg-cover bg-center" 
               style="background-image: url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80');">
          </div>
        </div>

        <!-- Dark Cinematic Contrast Vignettes -->
        <div class="absolute inset-0 bg-black/55 backdrop-brightness-90"></div>
        <div class="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-[#090909]"></div>

        <!-- Center Content -->
        <div class="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <span class="text-xs font-bold uppercase tracking-[3px] text-gold mb-4 inline-block drop-shadow">
            HAUTE GASTRONOMY & BESPOKE DOORSTEP SERVICE
          </span>
          <h1 class="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white tracking-tight uppercase leading-none mb-6 drop-shadow-[0_12px_30px_rgba(0,0,0,0.9)]">
            SIMPLY DELICIOUS
          </h1>
          <p class="text-sm sm:text-base md:text-lg text-neutral-200 max-w-2xl mx-auto leading-relaxed mb-3 drop-shadow font-normal">
            A transcendent culinary journey combining exquisite flavors, fine dining ambiance, and exceptional hospitality curated by celebrated master chefs.
          </p>
          <p class="text-xs sm:text-sm text-neutral-300 max-w-xl mx-auto leading-relaxed mb-9 drop-shadow">
            From wood-fired cuts and hand-rolled pastas to private salon dining, enjoy artisanal recipes prepared from organic provenance and delivered with precision to your table.
          </p>
          <div class="flex flex-wrap items-center justify-center gap-4">
            <a routerLink="/restaurants" 
               class="inline-block px-9 py-4 bg-white hover:bg-neutral-200 text-black font-extrabold text-xs uppercase tracking-[2px] rounded transition-all duration-300 shadow-2xl hover:scale-105">
              EXPLORE RESTAURANTS
            </a>
            <a routerLink="/about" 
               class="inline-block px-8 py-4 bg-transparent hover:bg-white/10 text-white font-bold text-xs uppercase tracking-[2px] border border-white/40 hover:border-white rounded transition-all duration-300">
              DISCOVER OUR STORY
            </a>
          </div>
        </div>
      </section>

      <!-- SECTION: MORE THAN JUST A RESTAURANT -->
      <section class="py-20 lg:py-28">
        <div class="w-full max-w-7xl mx-auto px-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span class="text-xs font-bold uppercase tracking-[2.5px] text-gold mb-3 inline-block">CULINARY EXCELLENCE</span>
              <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">More than just a restaurant</h2>
              <p class="text-base text-neutral-400 leading-relaxed my-6">
                UrbanBite was conceived to bridge the gap between world-class culinary craftsmanship and effortless modern delivery. Every partnered restaurant is handpicked for its commitment to pristine ingredients, scratch cooking, and artistic plating.
              </p>
              <div class="flex gap-10 my-8 border-t border-[#242424] pt-6">
                <div>
                  <span class="block text-3xl font-extrabold text-white font-serif">48h</span>
                  <span class="text-xs text-neutral-400 uppercase tracking-wider">Slow Cold Fermentation</span>
                </div>
                <div>
                  <span class="block text-3xl font-extrabold text-white font-serif">100%</span>
                  <span class="text-xs text-neutral-400 uppercase tracking-wider">Scratch Recipes</span>
                </div>
              </div>
              <a routerLink="/about" class="inline-flex items-center gap-2 px-6 py-3 border border-neutral-700 text-white font-bold text-xs uppercase tracking-wider rounded hover:border-white hover:bg-white/5 transition-all">
                LEARN OUR STORY
              </a>
            </div>

            <div class="relative rounded overflow-hidden border border-[#242424] h-[460px] group">
              <img src="https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&q=80" alt="Culinary craftsmanship" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div class="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/90 to-transparent">
                <span class="text-[11px] font-bold tracking-[2px] text-gold">KOFEO SIGNATURE</span>
                <h4 class="text-xl font-bold text-white mt-1.5">Hand-Rolled Black Truffle Tagliolini</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- SECTION: EXPLORE BY OUR CUISINES -->
      <section class="py-20 lg:py-28">
        <div class="w-full max-w-7xl mx-auto px-6">
          <div class="text-center mb-14">
            <span class="text-xs font-bold uppercase tracking-[2.5px] text-gold mb-3 inline-block">CURATED SELECTION</span>
            <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Explore By Our Cuisines</h2>
            <p class="text-neutral-400 text-sm sm:text-base max-w-lg mx-auto mt-3">Discover an array of flavor profiles created by celebrated master chefs.</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div (click)="filterCuisine('Italian')" class="bg-[#141414] border border-[#242424] rounded p-8 flex flex-col justify-between hover:border-white hover:bg-[#181818] hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
              <div>
                <div class="text-[11px] font-bold tracking-widest text-neutral-400 mb-5">01 / 04</div>
                <h3 class="text-xl font-bold text-white mb-3">Artisanal Pasta</h3>
                <p class="text-sm text-neutral-400 leading-relaxed mb-6">Hand-rolled pasta, 24-month Parmigiano, and winter truffles.</p>
              </div>
              <a routerLink="/restaurants" [queryParams]="{cuisine: 'Italian'}" class="text-xs font-bold tracking-wider text-white flex items-center gap-2 group-hover:text-gold transition-colors">
                VIEW DISHES <i class="fa-solid fa-arrow-right"></i>
              </a>
            </div>

            <div (click)="filterCuisine('Burgers')" class="bg-[#141414] border border-[#242424] rounded p-8 flex flex-col justify-between hover:border-white hover:bg-[#181818] hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
              <div>
                <div class="text-[11px] font-bold tracking-widest text-neutral-400 mb-5">02 / 04</div>
                <h3 class="text-xl font-bold text-white mb-3">Gourmet Burgers</h3>
                <p class="text-sm text-neutral-400 leading-relaxed mb-6">Dry-aged prime brisket, brioche buns, and house truffled aioli.</p>
              </div>
              <a routerLink="/restaurants" [queryParams]="{cuisine: 'Burgers'}" class="text-xs font-bold tracking-wider text-white flex items-center gap-2 group-hover:text-gold transition-colors">
                VIEW DISHES <i class="fa-solid fa-arrow-right"></i>
              </a>
            </div>

            <div (click)="filterCuisine('Woodfired')" class="bg-[#141414] border border-[#242424] rounded p-8 flex flex-col justify-between hover:border-white hover:bg-[#181818] hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
              <div>
                <div class="text-[11px] font-bold tracking-widest text-neutral-400 mb-5">03 / 04</div>
                <h3 class="text-xl font-bold text-white mb-3">Woodfired Pizza</h3>
                <p class="text-sm text-neutral-400 leading-relaxed mb-6">48-hour fermented dough blistered in 900°F oak-fired stone ovens.</p>
              </div>
              <a routerLink="/restaurants" [queryParams]="{cuisine: 'Italian'}" class="text-xs font-bold tracking-wider text-white flex items-center gap-2 group-hover:text-gold transition-colors">
                VIEW DISHES <i class="fa-solid fa-arrow-right"></i>
              </a>
            </div>

            <div (click)="filterCuisine('Japanese')" class="bg-[#141414] border border-[#242424] rounded p-8 flex flex-col justify-between hover:border-white hover:bg-[#181818] hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
              <div>
                <div class="text-[11px] font-bold tracking-widest text-neutral-400 mb-5">04 / 04</div>
                <h3 class="text-xl font-bold text-white mb-3">Asian & Omakase</h3>
                <p class="text-sm text-neutral-400 leading-relaxed mb-6">Toyosu market sashimi, binchotan robata skewers, and hand rolls.</p>
              </div>
              <a routerLink="/restaurants" [queryParams]="{cuisine: 'Japanese'}" class="text-xs font-bold tracking-wider text-white flex items-center gap-2 group-hover:text-gold transition-colors">
                VIEW DISHES <i class="fa-solid fa-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- SECTION: FEATURED RESTAURANTS -->
      <section class="py-20 lg:py-28 ">
        <div class="w-full max-w-7xl mx-auto px-6">
          <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span class="text-xs font-bold uppercase tracking-[2.5px] text-gold mb-3 inline-block">PARTNER BISTROS</span>
              <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Premier Dining Destinations</h2>
            </div>
            <a routerLink="/restaurants" class="inline-flex items-center gap-2 px-6 py-3 border border-neutral-700 text-white font-bold text-xs uppercase tracking-wider rounded hover:border-white hover:bg-white/5 transition-all self-start sm:self-auto">
              VIEW ALL ({{ restaurants.length }})
            </a>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div *ngFor="let restaurant of (restaurants | slice:0:3)" 
                 class="bg-[#141414] border border-[#242424] hover:border-gold/50 rounded overflow-hidden hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(0,0,0,0.85)] transition-all duration-500 flex flex-col group">
              
              <!-- Card Image Area -->
              <div class="relative h-60 overflow-hidden bg-neutral-950">
                <img [src]="restaurant.imageUrl" [alt]="restaurant.name" 
                     class="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700" />
                
                <!-- Dark Vignette Overlay -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"></div>

                <!-- Badges -->
                <div class="absolute top-4 left-4">
                  <span class="text-[10px] font-extrabold tracking-wider px-3 py-1 rounded backdrop-blur-md border flex items-center gap-1.5 shadow-md"
                        [ngClass]="restaurant.isOpen ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40' : 'bg-black/80 text-neutral-400 border-neutral-700'">
                    <span class="w-1.5 h-1.5 rounded-full" [ngClass]="restaurant.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-neutral-500'"></span>
                    <span>{{ restaurant.isOpen ? 'OPEN NOW' : 'CLOSED' }}</span>
                  </span>
                </div>

                <div class="absolute top-4 right-4">
                  <span class="text-xs font-extrabold px-3 py-1 rounded bg-black/85 backdrop-blur border border-white/10 text-gold flex items-center gap-1.5 shadow-md">
                    <i class="fa-solid fa-star text-[10px]"></i> {{ restaurant.rating }}
                    <span class="text-neutral-400 text-[10px] font-normal">({{ restaurant.totalReviews }})</span>
                  </span>
                </div>

                <!-- City Pill -->
                <div class="absolute bottom-3 left-4 flex items-center gap-1.5 text-xs text-white/90 font-medium drop-shadow">
                  <i class="fa-solid fa-location-dot text-gold text-[10px]"></i>
                  <span>{{ restaurant.city }}</span>
                </div>
              </div>

              <!-- Card Body -->
              <div class="p-6 sm:p-7 flex flex-col flex-grow">
                <span class="text-[10px] font-extrabold tracking-[2px] uppercase text-gold mb-2 block">
                  {{ restaurant.cuisine }} GASTRONOMY
                </span>
                <h3 class="text-xl font-bold text-white mb-2 group-hover:text-gold transition-colors leading-snug">
                  {{ restaurant.name }}
                </h3>
                <p class="text-xs sm:text-sm text-neutral-400 line-clamp-2 leading-relaxed mb-6 flex-grow">
                  {{ restaurant.tagline || restaurant.description }}
                </p>

                <!-- Metadata Strip -->
                <div class="grid grid-cols-3 gap-2 py-3.5 border-t border-b border-[#202020] text-center text-neutral-300 text-xs mb-6">
                  <div>
                    <span class="block text-[10px] uppercase tracking-wider text-neutral-500 font-bold mb-0.5">DISPATCH</span>
                    <span class="font-bold text-white flex items-center justify-center gap-1 text-[11px]">
                      <i class="fa-regular fa-clock text-gold text-[10px]"></i> {{ restaurant.avgDeliveryTimeMinutes }}m
                    </span>
                  </div>
                  <div class="border-x border-[#202020]">
                    <span class="block text-[10px] uppercase tracking-wider text-neutral-500 font-bold mb-0.5">COURIER</span>
                    <span class="font-bold text-white text-[11px]">
                      {{ restaurant.deliveryFee === 0 ? 'FREE' : ('$' + restaurant.deliveryFee) }}
                    </span>
                  </div>
                  <div>
                    <span class="block text-[10px] uppercase tracking-wider text-neutral-500 font-bold mb-0.5">MIN ORDER</span>
                    <span class="font-bold text-white text-[11px]">
                      &#36;{{ restaurant.minOrderAmount }}
                    </span>
                  </div>
                </div>

                <!-- Action CTA -->
                <a [routerLink]="['/restaurants', restaurant.id]" 
                   class="w-full py-3.5 bg-white hover:bg-gold text-black font-extrabold text-xs uppercase tracking-[2px] rounded transition-all duration-300 shadow-lg hover:shadow-gold/20 flex items-center justify-center gap-2 group/btn">
                  <span>VIEW MENU & ORDER</span>
                  <i class="fa-solid fa-arrow-right text-[10px] group-hover/btn:translate-x-1 transition-transform"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- SECTION: DINING EXPERIENCE & SCHEDULE -->
      <section class="py-20 lg:py-28">
        <div class="w-full max-w-7xl mx-auto px-6">
          <div class="bg-[#101010] border border-[#242424] rounded p-10 sm:p-16">
            <div class="max-w-3xl">
              <span class="text-xs font-bold uppercase tracking-[2.5px] text-gold mb-3 inline-block">ATMOSPHERE & DELIVERY</span>
              <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">A timeless dining experience that moves with your lifestyle.</h2>
              <p class="text-base text-neutral-400 leading-relaxed my-6">
                Whether you choose an intimate candlelight dinner at our Park West loft or prefer fine dining plated directly on your private table at home, UrbanBite preserves temperature, texture, and presentation with specialized thermal packaging.
              </p>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-[#242424] pt-8">
                <div>
                  <h4 class="text-xs font-bold tracking-[2px] text-white uppercase mb-3">LOFT DINING ROOMS</h4>
                  <p class="text-sm text-neutral-400 leading-relaxed">Mon - Thu: 11:30 AM - 10:00 PM</p>
                  <p class="text-sm text-neutral-400 leading-relaxed">Fri - Sun: 10:00 AM - 11:30 PM</p>
                </div>
                <div>
                  <h4 class="text-xs font-bold tracking-[2px] text-white uppercase mb-3">EXPRESS DOORSTEP DELIVERY</h4>
                  <p class="text-sm text-neutral-400 leading-relaxed">Mon - Sun: 11:00 AM - 11:00 PM</p>
                  <p class="text-sm text-neutral-400 leading-relaxed">Priority delivery within 30-40 minutes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- SECTION: REVIEWS FROM OUR GUESTS -->
      <section class="py-20 lg:py-28">
        <div class="w-full max-w-7xl mx-auto px-6">
          <div class="text-center mb-14">
            <span class="text-xs font-bold uppercase tracking-[2.5px] text-gold mb-3 inline-block">AUTHENTIC FEEDBACK</span>
            <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Reviews from Our Guests</h2>
            <p class="text-neutral-400 text-sm sm:text-base max-w-lg mx-auto mt-3">Read what diners and food critics say about their UrbanBite experience.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-[#141414] border border-[#242424] rounded p-8 flex flex-col justify-between">
              <div>
                <div class="text-gold text-xs flex gap-1 mb-5">
                  <i class="fa-solid fa-star" *ngFor="let s of [1,2,3,4,5]"></i>
                </div>
                <p class="text-sm text-neutral-300 leading-relaxed italic mb-6">
                  "The Black Truffle Tagliolini arrived piping hot and smelled exactly like a trattoria in Bologna. The packaging is immaculate."
                </p>
              </div>
              <div>
                <strong class="block text-sm text-white">Eleanor Vance</strong>
                <span class="text-xs text-neutral-400">New York Times Food Columnist</span>
              </div>
            </div>

            <div class="bg-[#141414] border border-[#242424] rounded p-8 flex flex-col justify-between">
              <div>
                <div class="text-gold text-xs flex gap-1 mb-5">
                  <i class="fa-solid fa-star" *ngFor="let s of [1,2,3,4,5]"></i>
                </div>
                <p class="text-sm text-neutral-300 leading-relaxed italic mb-6">
                  "Ordering from Kofeo on UrbanBite has become our weekly ritual. Flawless woodfired crust and rapid courier delivery every single time."
                </p>
              </div>
              <div>
                <strong class="block text-sm text-white">Julian Mercer</strong>
                <span class="text-xs text-neutral-400">Architect & Urban Planner</span>
              </div>
            </div>

            <div class="bg-[#141414] border border-[#242424] rounded p-8 flex flex-col justify-between">
              <div>
                <div class="text-gold text-xs flex gap-1 mb-5">
                  <i class="fa-solid fa-star" *ngFor="let s of [1,2,3,4,5]"></i>
                </div>
                <p class="text-sm text-neutral-300 leading-relaxed italic mb-6">
                  "Finally a delivery platform that treats gastronomy with respect. Real time tracking and zero compromise on food quality."
                </p>
              </div>
              <div>
                <strong class="block text-sm text-white">Clara Laurent</strong>
                <span class="text-xs text-neutral-400">Sommelier & Restaurateur</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- SECTION: PRE-FOOTER PHOTO STRIP -->
      <section class="pt-16 pb-0">
        <div class="w-full max-w-7xl mx-auto px-6 flex justify-between items-center mb-6">
          <div class="flex items-center gap-2.5 text-sm font-bold tracking-wider text-white">
            <i class="fa-brands fa-instagram text-lg"></i>
            <span>&#64;urbanbite.gastronomy</span>
          </div>
          <a href="https://instagram.com" target="_blank" class="px-4 py-2 border border-neutral-700 text-white font-bold text-xs uppercase tracking-wider rounded hover:border-white hover:bg-white/5 transition-all">
            FOLLOW &#64;URBANBITE
          </a>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 h-48 lg:h-56">
          <div class="bg-cover bg-center brightness-90 hover:brightness-100 transition-all duration-300" style="background-image: url('https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&q=80');"></div>
          <div class="bg-cover bg-center brightness-90 hover:brightness-100 transition-all duration-300" style="background-image: url('https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&q=80');"></div>
          <div class="bg-cover bg-center brightness-90 hover:brightness-100 transition-all duration-300" style="background-image: url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80');"></div>
          <div class="bg-cover bg-center brightness-90 hover:brightness-100 transition-all duration-300" style="background-image: url('https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400&q=80');"></div>
          <div class="bg-cover bg-center brightness-90 hover:brightness-100 transition-all duration-300" style="background-image: url('https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80');"></div>
          <div class="bg-cover bg-center brightness-90 hover:brightness-100 transition-all duration-300" style="background-image: url('https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80');"></div>
        </div>
      </section>
    </div>
  `
})
export class HomeComponent implements OnInit {
  restaurants: Restaurant[] = [];

  constructor(private restaurantService: RestaurantService) {}

  ngOnInit(): void {
    this.restaurantService.getRestaurants().subscribe({
      next: res => {
        if (res.success && res.data) {
          this.restaurants = res.data;
        }
      },
      error: err => {
        console.error('Error fetching restaurants:', err);
      }
    });
  }

  filterCuisine(cuisine: string): void {
    // Navigation handled via routerLink
  }
}
