import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-[#090909]">
      <!-- HERO SECTION MATCHING CONTACT US -->
      <section class="relative py-20 lg:py-24 overflow-hidden">
        <!-- Watermark Background -->
        <div class="absolute top-2 left-1/2 -translate-x-1/2 font-serif text-[clamp(80px,14vw,190px)] font-extrabold text-white/[0.025] tracking-widest pointer-events-none select-none whitespace-nowrap z-0">
          About us
        </div>

        <div class="relative z-10 w-full max-w-7xl mx-auto px-6 text-center">
          <span class="text-xs font-bold uppercase tracking-[2.5px] text-gold mb-3 inline-block">HERITAGE & VISION</span>
          <h1 class="text-5xl sm:text-7xl font-black text-white tracking-tight uppercase mb-6">ABOUT US</h1>
          <p class="text-base sm:text-lg text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            A sanctuary where culinary artistry meets bespoke doorstep delivery. Discover our origins, values, and uncompromising pursuit of flavor.
          </p>
        </div>

        <div class="relative z-10 w-full max-w-7xl mx-auto px-6 mt-12">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 h-auto md:h-96">
            <div class="md:col-span-2 h-64 md:h-full rounded border border-[#242424] bg-cover bg-center" 
                 style="background-image: url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80');"></div>
            <div class="h-64 md:h-full rounded border border-[#242424] bg-cover bg-center" 
                 style="background-image: url('https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=500&q=80');"></div>
            <div class="h-64 md:h-full rounded border border-[#242424] bg-cover bg-center" 
                 style="background-image: url('https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=500&q=80');"></div>
          </div>
        </div>
      </section>

      <!-- SECTION: OUR HISTORY -->
      <section class="py-20 lg:py-28">
        <div class="w-full max-w-7xl mx-auto px-6">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
            <!-- Col 1: Text -->
            <div>
              <span class="text-xs font-bold uppercase tracking-[2.5px] text-gold mb-3 inline-block">ORIGINS</span>
              <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-6">Our History</h2>
              <p class="text-sm sm:text-base text-neutral-400 leading-relaxed mb-5">
                Founded with a fierce devotion to preserving gastronomic integrity, UrbanBite began as an intimate 12-table culinary salon in the historic Loft District. Our vision was simple: honor traditional European fermentation and artisanal grilling while making elevated flavors directly accessible to modern connoisseurs.
              </p>
              <p class="text-sm sm:text-base text-neutral-400 leading-relaxed mb-8">
                Over the past decade, we expanded our curation to partner only with certified master chefs who share our strict ethos: seasonal provenance, zero artificial additives, and respect for culinary craft.
              </p>
              <a routerLink="/restaurants" class="inline-flex items-center gap-2 px-6 py-3 border border-neutral-700 text-white font-bold text-xs uppercase tracking-wider rounded hover:border-white hover:bg-white/5 transition-all">
                EXPLORE CURATED MENUS
              </a>
            </div>

            <!-- Col 2: Center Image -->
            <div class="h-[420px] rounded overflow-hidden border border-[#242424]">
              <img src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&q=80" alt="Master Chef Preparing Dish" class="w-full h-full object-cover" />
            </div>

            <!-- Col 3: Right Feature Callout -->
            <div class="bg-[#141414] border border-[#242424] rounded overflow-hidden">
              <img src="https://images.unsplash.com/photo-1544025162-d76694265947?w=500&q=80" alt="Signature steak plating" class="h-48 w-full object-cover" />
              <div class="p-6">
                <h4 class="text-lg font-bold text-white mb-2">Sourced with Ethics</h4>
                <p class="text-sm text-neutral-400 leading-relaxed">
                  Every steak, olive oil, and organic vegetable is sourced directly from sustainable family-run farms and biodynamic estates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- SECTION: CRAFT YOUR DINING EXPERIENCE -->
      <section class="py-20 lg:py-28">
        <div class="w-full max-w-7xl mx-auto px-6">
          <div class="text-center mb-14">
            <span class="text-xs font-bold uppercase tracking-[2.5px] text-gold mb-3 inline-block">OPERATIONS & LOCATIONS</span>
            <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Craft Your Dining Experience</h2>
            <p class="text-neutral-400 text-sm sm:text-base max-w-lg mx-auto mt-3">Visit our physical culinary lofts or order direct delivery to your residence.</p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            <!-- Left Image -->
            <div class="rounded border border-[#242424] bg-cover bg-center min-h-[340px]" 
                 style="background-image: url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80');"></div>

            <!-- Center Hours & Locations -->
            <div class="bg-[#111] border border-[#242424] rounded p-8 sm:p-10 flex flex-col justify-center">
              <div>
                <h3 class="text-xl font-bold text-white mb-1">45 Park West Ave Loft</h3>
                <span class="text-xs text-gold font-bold tracking-wider uppercase block mb-4">Downtown Arts District</span>
                <div class="flex justify-between py-2 border-b border-[#1f1f1f] text-sm text-neutral-400">
                  <span>Mon - Thu</span>
                  <strong class="text-white">11:30 AM - 10:00 PM</strong>
                </div>
                <div class="flex justify-between py-2 text-sm text-neutral-400">
                  <span>Fri - Sun</span>
                  <strong class="text-white">10:00 AM - 11:30 PM</strong>
                </div>
              </div>

              <div class="h-px bg-[#242424] my-6"></div>

              <div>
                <h3 class="text-xl font-bold text-white mb-1">82 Bedford St Loft</h3>
                <span class="text-xs text-gold font-bold tracking-wider uppercase block mb-4">West Village Historic District</span>
                <div class="flex justify-between py-2 border-b border-[#1f1f1f] text-sm text-neutral-400">
                  <span>Mon - Thu</span>
                  <strong class="text-white">12:00 PM - 09:30 PM</strong>
                </div>
                <div class="flex justify-between py-2 text-sm text-neutral-400">
                  <span>Fri - Sun</span>
                  <strong class="text-white">11:00 AM - 11:00 PM</strong>
                </div>
              </div>

              <div class="mt-8">
                <a routerLink="/restaurants" class="w-full text-center block py-3.5 bg-white text-black font-bold text-xs uppercase tracking-wider rounded hover:bg-neutral-200 transition-all">
                  ORDER FROM OUR LOFTS
                </a>
              </div>
            </div>

            <!-- Right Image -->
            <div class="rounded border border-[#242424] bg-cover bg-center min-h-[340px]" 
                 style="background-image: url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80');"></div>
          </div>
        </div>
      </section>

      <!-- SECTION: LATEST ARTICLES -->
      <section class="py-20 lg:py-28">
        <div class="w-full max-w-7xl mx-auto px-6">
          <div class="mb-12">
            <span class="text-xs font-bold uppercase tracking-[2.5px] text-gold mb-3 inline-block">CULINARY JOURNAL</span>
            <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Latest Articles</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="bg-[#141414] border border-[#242424] rounded overflow-hidden hover:border-neutral-600 hover:-translate-y-1 transition-all duration-300">
              <div class="h-48 bg-cover bg-center" style="background-image: url('https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=500&q=80');"></div>
              <div class="p-6">
                <span class="text-[11px] font-bold tracking-wider text-gold uppercase block mb-2.5">OCTOBER 2026 • 4 MIN READ</span>
                <h3 class="text-lg font-bold text-white mb-2.5 leading-snug">The Alchemy of 48-Hour Cold Pasta Fermentation</h3>
                <p class="text-sm text-neutral-400 leading-relaxed">How time, humidity, and bronze extrusion dyes transform ancient grains into unparalleled pasta textures.</p>
              </div>
            </div>

            <div class="bg-[#141414] border border-[#242424] rounded overflow-hidden hover:border-neutral-600 hover:-translate-y-1 transition-all duration-300">
              <div class="h-48 bg-cover bg-center" style="background-image: url('https://images.unsplash.com/photo-1544025162-d76694265947?w=500&q=80');"></div>
              <div class="p-6">
                <span class="text-[11px] font-bold tracking-wider text-gold uppercase block mb-2.5">SEPTEMBER 2026 • 6 MIN READ</span>
                <h3 class="text-lg font-bold text-white mb-2.5 leading-snug">Selecting Marble Score 7+ Wagyu with Chef Bellini</h3>
                <p class="text-sm text-neutral-400 leading-relaxed">An inside look into our Japanese cattle partner farms and the secrets behind bone marrow jus reduction.</p>
              </div>
            </div>

            <div class="bg-[#141414] border border-[#242424] rounded overflow-hidden hover:border-neutral-600 hover:-translate-y-1 transition-all duration-300">
              <div class="h-48 bg-cover bg-center" style="background-image: url('https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=500&q=80');"></div>
              <div class="p-6">
                <span class="text-[11px] font-bold tracking-wider text-gold uppercase block mb-2.5">SEPTEMBER 2026 • 3 MIN READ</span>
                <h3 class="text-lg font-bold text-white mb-2.5 leading-snug">Single Origin Extraction: The Cold Drip Ritual</h3>
                <p class="text-sm text-neutral-400 leading-relaxed">Why temperature stability and high altitude Ethiopian micro-lots produce notes of jasmine and wild berries.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `
})
export class AboutComponent {}
