import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <footer class="relative bg-[#070707] border-t border-[#242424] overflow-hidden pt-24 pb-10">
      <!-- Massive Background Watermark matching screenshot -->
      <div class="absolute bottom-5 left-1/2 -translate-x-1/2 w-full text-center pointer-events-none z-0">
        <div class="font-serif text-[clamp(80px,16vw,220px)] font-extrabold text-white/[0.03] tracking-wider leading-none select-none">
          UrbanBite
        </div>
      </div>

      <div class="relative z-10 w-full max-w-7xl mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <!-- Col 1: Brand & Contact Info -->
          <div>
            <h4 class="text-xs font-bold tracking-[2px] text-white uppercase mb-6">ABOUT URBANBITE</h4>
            <p class="text-sm text-neutral-400 leading-relaxed mb-4">
              45 Park West Ave, Loft District<br>
              New York, NY 10001
            </p>
            <p class="text-sm leading-relaxed mb-6">
              <a href="tel:+15550194400" class="text-white hover:text-gold transition-colors">+1 (555) 019-4400</a><br>
              <a href="mailto:concierge@urbanbite.com" class="text-white hover:text-gold transition-colors">concierge&#64;urbanbite.com</a>
            </p>
            <div class="flex items-center gap-4">
              <a href="#" aria-label="Instagram" class="text-neutral-500 hover:text-white transition-colors text-base"><i class="fa-brands fa-instagram"></i></a>
              <a href="#" aria-label="Twitter" class="text-neutral-500 hover:text-white transition-colors text-base"><i class="fa-brands fa-x-twitter"></i></a>
              <a href="#" aria-label="Facebook" class="text-neutral-500 hover:text-white transition-colors text-base"><i class="fa-brands fa-facebook-f"></i></a>
              <a href="#" aria-label="LinkedIn" class="text-neutral-500 hover:text-white transition-colors text-base"><i class="fa-brands fa-linkedin-in"></i></a>
            </div>
          </div>

          <!-- Col 2: Pages -->
          <div>
            <h4 class="text-xs font-bold tracking-[2px] text-white uppercase mb-6">PAGES</h4>
            <ul class="flex flex-col gap-3">
              <li><a routerLink="/about" class="text-sm text-neutral-400 hover:text-white transition-colors">Our Story</a></li>
              <li><a routerLink="/restaurants" class="text-sm text-neutral-400 hover:text-white transition-colors">Restaurants</a></li>
              <li><a routerLink="/restaurants" class="text-sm text-neutral-400 hover:text-white transition-colors">Artisanal Menus</a></li>
              <li><a routerLink="/about" class="text-sm text-neutral-400 hover:text-white transition-colors">Dining Lofts</a></li>
              <li><a routerLink="/contact" class="text-sm text-neutral-400 hover:text-white transition-colors">Culinary Journal</a></li>
            </ul>
          </div>

          <!-- Col 3: Utilities -->
          <div>
            <h4 class="text-xs font-bold tracking-[2px] text-white uppercase mb-6">UTILITIES</h4>
            <ul class="flex flex-col gap-3">
              <li><a routerLink="/contact" class="text-sm text-neutral-400 hover:text-white transition-colors">Contact Us</a></li>
              <li><a routerLink="/contact" class="text-sm text-neutral-400 hover:text-white transition-colors">FAQs & Inquiries</a></li>
              <li><a routerLink="/about" class="text-sm text-neutral-400 hover:text-white transition-colors">Delivery Policies</a></li>
              <li><a routerLink="/about" class="text-sm text-neutral-400 hover:text-white transition-colors">Terms & Conditions</a></li>
              <li><a routerLink="/about" class="text-sm text-neutral-400 hover:text-white transition-colors">Licensing</a></li>
            </ul>
          </div>

          <!-- Col 4: Newsletter -->
          <div>
            <h4 class="text-xs font-bold tracking-[2px] text-white uppercase mb-6">JOIN THE CLUB</h4>
            <p class="text-sm text-neutral-400 leading-relaxed mb-4">Subscribe for private tasting invitations, chef specials, and seasonal releases.</p>
            <form (submit)="subscribe($event)" class="flex flex-col gap-2.5">
              <input type="email" [(ngModel)]="email" name="email" placeholder="ENTER YOUR EMAIL" required 
                     class="px-4 py-3 bg-[#111] border border-[#333] rounded text-white text-xs tracking-wider outline-none focus:border-white transition-colors" />
              <button type="submit" 
                      class="px-5 py-3 bg-white text-black font-bold text-xs uppercase tracking-wider rounded hover:bg-neutral-200 transition-all cursor-pointer">
                {{ subscribed ? 'SUBSCRIBED!' : 'SUBSCRIBE' }}
              </button>
            </form>
          </div>
        </div>

        <div class="border-t border-[#1a1a1a] pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4 text-center sm:text-left">
          <p>© 2026 UrbanBite. All rights reserved.</p>
          <p>Crafted for elevated culinary experiences & artisanal delivery.</p>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  email: string = '';
  subscribed: boolean = false;

  subscribe(event: Event): void {
    event.preventDefault();
    if (this.email) {
      this.subscribed = true;
      setTimeout(() => {
        this.email = '';
        this.subscribed = false;
      }, 4000);
    }
  }
}
