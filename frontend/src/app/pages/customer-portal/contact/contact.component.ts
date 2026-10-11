import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface FaqItem {
  question: string;
  answer: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-[#090909]">
      <!-- HERO & CONTACT FORM -->
      <section class="relative py-20 lg:py-24 overflow-hidden">
        <!-- Watermark Background -->
        <div class="absolute top-2 left-1/2 -translate-x-1/2 font-serif text-[clamp(80px,14vw,190px)] font-extrabold text-white/[0.025] tracking-widest pointer-events-none select-none whitespace-nowrap z-0">
          Contact us
        </div>

        <div class="relative z-10 w-full max-w-7xl mx-auto px-6">
          <div class="text-center mb-14">
            <span class="text-xs font-bold uppercase tracking-[2.5px] text-gold mb-3 inline-block">CONCIERGE & INQUIRIES</span>
            <h1 class="text-5xl sm:text-7xl font-black text-white tracking-tight uppercase mb-6">CONTACT US</h1>
            <p class="text-base sm:text-lg text-neutral-300 max-w-2xl mx-auto leading-relaxed">
              Whether you have inquiries about reservations, menu details, dietary accommodations, or special catering requests, feel free to reach out to our concierge team.
            </p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
            <!-- LEAVE A MESSAGE FORM (Left) -->
            <div class="bg-[#141414] border border-[#242424] rounded p-8 sm:p-10 shadow-2xl flex flex-col justify-between">
              <div>
                <span class="text-[10px] font-extrabold uppercase tracking-[2px] text-gold block mb-1">DIRECT INQUIRY</span>
                <h3 class="text-xl font-bold text-white mb-7">Leave a Message</h3>
              </div>
              <form (submit)="onSubmit($event)" class="space-y-5">
                <div class="relative">
                  <i class="fa-regular fa-user absolute top-3.5 left-4 text-neutral-500 text-xs"></i>
                  <input type="text" [(ngModel)]="form.name" name="name" placeholder="Enter your legal name" required 
                         class="w-full pl-11 pr-4 py-3 bg-[#0d0d0d] border border-[#242424] focus:border-gold rounded text-white text-xs outline-none transition-colors" />
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="relative">
                    <i class="fa-solid fa-phone absolute top-3.5 left-4 text-neutral-500 text-xs"></i>
                    <input type="tel" [(ngModel)]="form.phone" name="phone" placeholder="Contact phone number" 
                           class="w-full pl-11 pr-4 py-3 bg-[#0d0d0d] border border-[#242424] focus:border-gold rounded text-white text-xs outline-none transition-colors" />
                  </div>
                  <div class="relative">
                    <i class="fa-regular fa-envelope absolute top-3.5 left-4 text-neutral-500 text-xs"></i>
                    <input type="email" [(ngModel)]="form.email" name="email" placeholder="Email address" required 
                           class="w-full pl-11 pr-4 py-3 bg-[#0d0d0d] border border-[#242424] focus:border-gold rounded text-white text-xs outline-none transition-colors" />
                  </div>
                </div>

                <div class="relative">
                  <i class="fa-regular fa-message absolute top-3.5 left-4 text-neutral-500 text-xs"></i>
                  <textarea [(ngModel)]="form.message" name="message" placeholder="Message or private catering inquiry..." required 
                            class="w-full pl-11 pr-4 py-3 bg-[#0d0d0d] border border-[#242424] focus:border-gold rounded text-white text-xs outline-none transition-colors min-h-[130px] resize-y"></textarea>
                </div>

                <div>
                  <button type="submit" [disabled]="submitting" 
                          class="w-full py-3.5 bg-gold hover:bg-gold-light text-black font-extrabold text-xs uppercase tracking-wider rounded transition-all cursor-pointer shadow-md disabled:opacity-50">
                    {{ submitting ? 'SENDING...' : (submitted ? 'MESSAGE SENT ✓' : 'SEND NOW') }}
                  </button>
                </div>

                <div *ngIf="submitted" class="p-3.5 bg-emerald-950/60 border border-emerald-500/40 rounded text-emerald-400 text-xs flex items-center gap-2">
                  <i class="fa-solid fa-circle-check"></i> Thank you! Your message has been received. Our concierge team will respond within 24 hours.
                </div>
              </form>
            </div>

            <!-- RESTAURANT INTERIOR PHOTO (Right) -->
            <div class="rounded overflow-hidden border border-[#242424] shadow-2xl min-h-[420px]">
              <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000&q=80" alt="UrbanBite restaurant dining room" class="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      <!-- EXPERIENCE OUR CUISINE, ANYWHERE (5-City Grid Matching Screenshot 3) -->
      <section class="py-20 lg:py-28">
        <div class="w-full max-w-7xl mx-auto px-6">
          <div class="mb-12">
            <span class="text-xs font-bold uppercase tracking-[2.5px] text-gold mb-3 inline-block">GLOBAL PRESENCE</span>
            <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Experience Our Cuisine, Anywhere</h2>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div class="h-72 rounded border border-[#242424] bg-cover bg-center relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300" 
                 style="background-image: url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=500&q=80');">
              <div class="absolute bottom-0 left-0 w-full p-5 bg-gradient-to-t from-black/95 via-black/70 to-transparent">
                <span class="text-[10px] font-extrabold tracking-wider text-gold">UAE</span>
                <h4 class="text-base font-bold text-white mt-1">DUBAI, UAE</h4>
                <p class="text-xs text-neutral-400">Downtown Boulevard Loft</p>
              </div>
            </div>

            <div class="h-72 rounded border border-[#242424] bg-cover bg-center relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300" 
                 style="background-image: url('https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=500&q=80');">
              <div class="absolute bottom-0 left-0 w-full p-5 bg-gradient-to-t from-black/95 via-black/70 to-transparent">
                <span class="text-[10px] font-extrabold tracking-wider text-gold">USA</span>
                <h4 class="text-base font-bold text-white mt-1">NEW YORK, USA</h4>
                <p class="text-xs text-neutral-400">Park West Arts District</p>
              </div>
            </div>

            <div class="h-72 rounded border border-[#242424] bg-cover bg-center relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300" 
                 style="background-image: url('https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=500&q=80');">
              <div class="absolute bottom-0 left-0 w-full p-5 bg-gradient-to-t from-black/95 via-black/70 to-transparent">
                <span class="text-[10px] font-extrabold tracking-wider text-gold">UK</span>
                <h4 class="text-base font-bold text-white mt-1">LONDON, UK</h4>
                <p class="text-xs text-neutral-400">Mayfair Culinary Salon</p>
              </div>
            </div>

            <div class="h-72 rounded border border-[#242424] bg-cover bg-center relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300" 
                 style="background-image: url('https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=500&q=80');">
              <div class="absolute bottom-0 left-0 w-full p-5 bg-gradient-to-t from-black/95 via-black/70 to-transparent">
                <span class="text-[10px] font-extrabold tracking-wider text-gold">JAPAN</span>
                <h4 class="text-base font-bold text-white mt-1">TOKYO, JAPAN</h4>
                <p class="text-xs text-neutral-400">Ginza Omakase Loft</p>
              </div>
            </div>

            <div class="h-72 rounded border border-[#242424] bg-cover bg-center relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300" 
                 style="background-image: url('https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500&q=80');">
              <div class="absolute bottom-0 left-0 w-full p-5 bg-gradient-to-t from-black/95 via-black/70 to-transparent">
                <span class="text-[10px] font-extrabold tracking-wider text-gold">FRANCE</span>
                <h4 class="text-base font-bold text-white mt-1">PARIS, FRANCE</h4>
                <p class="text-xs text-neutral-400">Saint-Germain Gastronomy</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- HAVE ANY QUESTIONS? (Luxury Redesigned FAQ Section) -->
      <section class="py-20 lg:py-28" id="faq">
        <div class="w-full max-w-7xl mx-auto px-6">
          
          <!-- Section Header -->
          <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-2">
            <div>
              <span class="text-xs font-bold uppercase tracking-[2.5px] text-gold mb-3 inline-block">HELP & CLARIFICATIONS</span>
              <h2 class="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase">Have Any Questions?</h2>
              <p class="text-xs sm:text-sm text-neutral-400 mt-2 max-w-xl leading-relaxed">
                Clear answers regarding our artisanal menus, temperature-controlled delivery, reservation policies, and bespoke private catering.
              </p>
            </div>
            <a href="mailto:concierge@urbanbite.com" 
               class="inline-flex items-center gap-2.5 px-5 py-3 rounded bg-[#141414] border border-[#262626] hover:border-gold/50 text-neutral-300 hover:text-white transition-all text-xs font-bold uppercase tracking-wider shadow-lg self-start md:self-auto cursor-pointer">
              <i class="fa-solid fa-headset text-gold"></i>
              <span>Direct Concierge Desk</span>
            </a>
          </div>

          <!-- Main 2-Column FAQ Layout -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            <!-- Left: Chef Showcase Card (5 cols on lg) -->
            <div class="lg:col-span-5">
              <div class="rounded overflow-hidden border border-[#242424] shadow-2xl relative group h-[480px] lg:h-[580px] bg-[#111]">
                <img src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=900&q=80" 
                     alt="Executive Culinary Director" 
                     class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent"></div>

                <!-- Floating Top Pill -->
                <div class="absolute top-5 left-5 right-5 flex justify-between items-center">
                  <span class="px-3 py-1 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-extrabold uppercase tracking-widest text-gold">
                    <i class="fa-solid fa-star text-[9px] mr-1"></i> MASTER CULINARY TEAM
                  </span>
                </div>

                <!-- Bottom Editorial Caption -->
                <div class="absolute bottom-0 left-0 right-0 p-6 sm:p-7">
                  <span class="text-[10px] font-extrabold uppercase tracking-[2px] text-gold block mb-1">CHEF PATRON'S NOTE</span>
                  <h4 class="text-lg font-bold text-white mb-2 leading-snug">"Gastronomy without compromise, from kitchen flame to private table."</h4>
                  <p class="text-xs text-neutral-300 leading-relaxed mb-4">
                    Our concierge and culinary teams monitor every dispatch live to maintain perfect plating warmth and flavor purity.
                  </p>
                  <div class="flex items-center gap-3 pt-3 border-t border-white/10 text-xs">
                    <div class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                    <span class="text-neutral-300 font-semibold text-[11px]">Culinary Desk on standby 7 days a week</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right: Interactive Accordion Cards (7 cols on lg) -->
            <div class="lg:col-span-7 space-y-3.5">
              <div *ngFor="let item of faqs; let i = index" 
                   class="bg-[#141414] border rounded transition-all duration-300 overflow-hidden shadow-lg"
                   [ngClass]="item.isOpen ? 'border-gold/50 shadow-gold/5 bg-[#16140e]' : 'border-[#242424] hover:border-[#383838]'">
                
                <button type="button" 
                        (click)="toggleFaq(i)"
                        class="w-full flex items-center justify-between p-5 text-left cursor-pointer transition-colors gap-4">
                  <div class="flex items-center gap-4 min-w-0">
                    <div class="w-8 h-8 rounded flex items-center justify-center shrink-0 text-xs font-black font-mono transition-colors"
                         [ngClass]="item.isOpen ? 'bg-gold text-black shadow-md' : 'bg-[#1b1b1b] text-neutral-400 border border-[#282828]'">
                      0{{ i + 1 }}
                    </div>
                    <span class="text-sm sm:text-base font-bold transition-colors leading-snug truncate sm:whitespace-normal"
                          [ngClass]="item.isOpen ? 'text-gold' : 'text-white'">
                      {{ item.question }}
                    </span>
                  </div>

                  <div class="w-8 h-8 rounded flex items-center justify-center shrink-0 transition-all duration-300"
                       [ngClass]="item.isOpen ? 'bg-gold/20 text-gold rotate-180' : 'bg-[#1b1b1b] text-neutral-500 border border-[#282828]'">
                    <i class="fa-solid fa-chevron-down text-xs"></i>
                  </div>
                </button>

                <div *ngIf="item.isOpen" 
                     class="px-5 pb-5 pt-1 text-xs sm:text-sm text-neutral-300 leading-relaxed border-t border-[#202020] animate-fadeIn">
                  <div class="sm:pl-12 pt-2">
                    <p>{{ item.answer }}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- Bottom Still Have Questions Banner -->
          <div class="mt-14 bg-gradient-to-r from-[#141414] via-[#1a1710] to-[#141414] border border-[#2e2617] rounded p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded bg-gold/15 border border-gold/40 text-gold flex items-center justify-center shrink-0 text-xl shadow-lg">
                <i class="fa-solid fa-comments"></i>
              </div>
              <div>
                <h4 class="text-base font-bold text-white">Have a Bespoke Culinary Request?</h4>
                <p class="text-xs text-neutral-400 mt-0.5">Special allergens, private dining room booking, or large event courier logistics.</p>
              </div>
            </div>
            <div class="flex flex-wrap items-center gap-3 shrink-0">
              <a href="tel:+15550194400" 
                 class="px-5 py-2.5 bg-[#0d0d0d] hover:bg-[#181818] border border-[#282828] text-neutral-300 hover:text-gold text-xs font-bold uppercase tracking-wider rounded transition-all flex items-center gap-2 cursor-pointer shadow">
                <i class="fa-solid fa-phone text-xs text-gold"></i>
                <span>+1 (555) 019-4400</span>
              </a>
              <a href="mailto:concierge@urbanbite.com" 
                 class="px-5 py-2.5 bg-gold hover:bg-gold-light text-black text-xs font-extrabold uppercase tracking-wider rounded transition-all shadow-md flex items-center gap-2 cursor-pointer">
                <i class="fa-regular fa-envelope text-xs"></i>
                <span>Priority Inquiries</span>
              </a>
            </div>
          </div>

        </div>
      </section>
    </div>
  `
})
export class ContactComponent {
  form = {
    name: '',
    phone: '',
    email: '',
    message: ''
  };

  submitting: boolean = false;
  submitted: boolean = false;

  faqs: FaqItem[] = [
    {
      question: 'How do I place an order or schedule doorstep delivery?',
      answer: 'Browse our curated collection of partner restaurants, select your preferred dishes along with any portion size or artisan add-ons, and proceed through checkout. You can select Cash on Delivery or use our instant online payment simulator.',
      isOpen: true
    },
    {
      question: "What are your restaurants' standard opening hours?",
      answer: 'Most of our loft and bistro kitchens operate Monday through Thursday from 11:30 AM to 10:00 PM, and Friday through Sunday from 10:00 AM to 11:30 PM. Specific hours for each restaurant are displayed on their details page.',
      isOpen: false
    },
    {
      question: 'Do you offer doorstep delivery or takeaway?',
      answer: 'Yes! UrbanBite specializes in dedicated priority doorstep delivery with temperature-controlled insulated packaging, as well as takeaway pickup directly from the restaurant counter.',
      isOpen: false
    },
    {
      question: 'Can I modify or cancel my order?',
      answer: 'You may cancel your order free of charge while its status remains "PLACED" or "ACCEPTED". Once our chefs begin preparation in the kitchen, cancellation is locked to avoid food waste.',
      isOpen: false
    },
    {
      question: 'Do you have private dining or catering options?',
      answer: 'We provide bespoke private dining and executive corporate catering packages. Please reach out via the message form above or contact concierge@urbanbite.com.',
      isOpen: false
    },
    {
      question: 'Is contactless delivery available?',
      answer: 'Yes, simply select contactless delivery instructions in your address notes during checkout, and our courier partner will leave your order safely at your door.',
      isOpen: false
    }
  ];

  toggleFaq(index: number): void {
    this.faqs[index].isOpen = !this.faqs[index].isOpen;
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.submitting = true;
    setTimeout(() => {
      this.submitting = false;
      this.submitted = true;
      this.form = { name: '', phone: '', email: '', message: '' };
    }, 800);
  }
}
