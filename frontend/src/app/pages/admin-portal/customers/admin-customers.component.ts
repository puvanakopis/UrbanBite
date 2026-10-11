import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { User, Role } from '../../../models/auth.models';
import { Restaurant } from '../../../models/restaurant.models';

type UserTab = 'ALL' | 'ROLE_CUSTOMER' | 'ROLE_RESTAURANT_OWNER' | 'ROLE_DELIVERY_PARTNER' | 'ROLE_ADMIN';

@Component({
  selector: 'app-admin-customers',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="bg-[#090909] min-h-[90vh] py-10 sm:py-14 text-neutral-200">
      <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <!-- Executive Page Header -->
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-5 border-b border-[#242424]">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span class="text-xs font-bold uppercase tracking-[2.5px] text-gold block">
                ADMINISTRATION & GOVERNANCE
              </span>
              <span class="text-neutral-600">•</span>
              <span class="text-xs font-bold uppercase tracking-wider text-neutral-400">
                4-Role User Registry
              </span>
            </div>
            <div class="flex flex-wrap items-center gap-3">
              <h1 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                User Management
              </h1>
              <span class="px-2.5 py-1 text-[10px] font-bold tracking-wider rounded uppercase bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center gap-1.5">
                <span class="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]"></span>
                {{ activeUsersCount }} Active Accounts
              </span>
            </div>
            <p class="text-xs sm:text-sm text-neutral-400 mt-2 max-w-2xl">
              Dedicated management tables for Customer Patrons, Restaurant Owners, Delivery Hub Couriers, and System Administrators.
            </p>
          </div>

          <!-- Header Quick Controls -->
          <div class="flex items-center gap-3">
            <button 
              (click)="loadData()" 
              class="px-4 py-2.5 border border-neutral-700 hover:border-white text-neutral-300 hover:text-white rounded text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2">
              <i class="fa-solid fa-arrows-rotate" [ngClass]="{'fa-spin': loading}"></i>
              <span>Refresh All</span>
            </button>

            <a 
              routerLink="/admin-portal/dashboard" 
              class="px-5 py-2.5 bg-gold hover:bg-gold-light text-black font-extrabold text-xs uppercase tracking-wider rounded transition-all cursor-pointer shadow-md flex items-center gap-2">
              <i class="fa-solid fa-chart-pie"></i>
              <span>Dashboard</span>
            </a>
          </div>
        </div>

        <!-- 4 Metric KPI Cards Strip (One per User Table Category) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <!-- Card 1: Customer Patrons -->
          <div 
            (click)="activeTab = 'ROLE_CUSTOMER'"
            class="bg-[#141414] border rounded p-5 shadow-xl cursor-pointer transition-all"
            [ngClass]="activeTab === 'ROLE_CUSTOMER' ? 'border-gold bg-[#181510]' : 'border-[#242424] hover:border-neutral-600'">
            <div class="flex justify-between items-start mb-2">
              <span class="text-[11px] font-bold tracking-wider uppercase" [ngClass]="activeTab === 'ROLE_CUSTOMER' ? 'text-gold' : 'text-neutral-400'">
                Customer Patrons
              </span>
              <div class="w-7 h-7 rounded bg-gold/15 text-gold flex items-center justify-center text-xs">
                <i class="fa-solid fa-user"></i>
              </div>
            </div>
            <div class="flex items-baseline gap-2 mb-1">
              <span class="text-3xl font-extrabold text-white font-serif">{{ customersCount }}</span>
              <span class="text-xs text-neutral-500">patrons</span>
            </div>
            <div class="flex items-center justify-between text-[11px] text-neutral-400 pt-2 border-t border-[#222222]">
              <span class="text-emerald-400 font-semibold">{{ getActiveCountByRole('ROLE_CUSTOMER') }} active</span>
              <span class="text-neutral-500">{{ getVerifiedCountByRole('ROLE_CUSTOMER') }} verified</span>
            </div>
          </div>

          <!-- Card 2: Restaurant Partners -->
          <div 
            (click)="activeTab = 'ROLE_RESTAURANT_OWNER'"
            class="bg-[#141414] border rounded p-5 shadow-xl cursor-pointer transition-all"
            [ngClass]="activeTab === 'ROLE_RESTAURANT_OWNER' ? 'border-purple-400 bg-[#16121a]' : 'border-[#242424] hover:border-neutral-600'">
            <div class="flex justify-between items-start mb-2">
              <span class="text-[11px] font-bold tracking-wider uppercase" [ngClass]="activeTab === 'ROLE_RESTAURANT_OWNER' ? 'text-purple-400' : 'text-neutral-400'">
                Restaurant Table
              </span>
              <div class="w-7 h-7 rounded bg-purple-950/60 text-purple-400 flex items-center justify-center text-xs">
                <i class="fa-solid fa-store"></i>
              </div>
            </div>
            <div class="flex items-baseline gap-2 mb-1">
              <span class="text-3xl font-extrabold text-white font-serif">{{ restaurantsCount }}</span>
              <span class="text-xs text-neutral-500">proprietors</span>
            </div>
            <div class="flex items-center justify-between text-[11px] text-neutral-400 pt-2 border-t border-[#222222]">
              <span class="text-emerald-400 font-semibold">{{ getActiveCountByRole('ROLE_RESTAURANT_OWNER') }} active</span>
              <span class="text-purple-400">{{ restaurantsList.length }} venues listed</span>
            </div>
          </div>

          <!-- Card 3: Delivery Hub -->
          <div 
            (click)="activeTab = 'ROLE_DELIVERY_PARTNER'"
            class="bg-[#141414] border rounded p-5 shadow-xl cursor-pointer transition-all"
            [ngClass]="activeTab === 'ROLE_DELIVERY_PARTNER' ? 'border-blue-400 bg-[#10141a]' : 'border-[#242424] hover:border-neutral-600'">
            <div class="flex justify-between items-start mb-2">
              <span class="text-[11px] font-bold tracking-wider uppercase" [ngClass]="activeTab === 'ROLE_DELIVERY_PARTNER' ? 'text-blue-400' : 'text-neutral-400'">
                Delivery Hub Table
              </span>
              <div class="w-7 h-7 rounded bg-blue-950/60 text-blue-400 flex items-center justify-center text-xs">
                <i class="fa-solid fa-motorcycle"></i>
              </div>
            </div>
            <div class="flex items-baseline gap-2 mb-1">
              <span class="text-3xl font-extrabold text-white font-serif">{{ couriersCount }}</span>
              <span class="text-xs text-neutral-500">couriers</span>
            </div>
            <div class="flex items-center justify-between text-[11px] text-neutral-400 pt-2 border-t border-[#222222]">
              <span class="text-emerald-400 font-semibold">{{ getActiveCountByRole('ROLE_DELIVERY_PARTNER') }} active</span>
              <span class="text-blue-400">{{ getVerifiedCountByRole('ROLE_DELIVERY_PARTNER') }} verified</span>
            </div>
          </div>

          <!-- Card 4: Admin Accounts -->
          <div 
            (click)="activeTab = 'ROLE_ADMIN'"
            class="bg-[#141414] border rounded p-5 shadow-xl cursor-pointer transition-all"
            [ngClass]="activeTab === 'ROLE_ADMIN' ? 'border-emerald-400 bg-[#0f1813]' : 'border-[#242424] hover:border-neutral-600'">
            <div class="flex justify-between items-start mb-2">
              <span class="text-[11px] font-bold tracking-wider uppercase" [ngClass]="activeTab === 'ROLE_ADMIN' ? 'text-emerald-400' : 'text-neutral-400'">
                Admin Table
              </span>
              <div class="w-7 h-7 rounded bg-emerald-950/60 text-emerald-400 flex items-center justify-center text-xs">
                <i class="fa-solid fa-shield-halved"></i>
              </div>
            </div>
            <div class="flex items-baseline gap-2 mb-1">
              <span class="text-3xl font-extrabold text-white font-serif">{{ adminsCount }}</span>
              <span class="text-xs text-neutral-500">admins</span>
            </div>
            <div class="flex items-center justify-between text-[11px] text-neutral-400 pt-2 border-t border-[#222222]">
              <span class="text-emerald-400 font-semibold">{{ getActiveCountByRole('ROLE_ADMIN') }} active</span>
              <span class="text-neutral-500">Full clearance</span>
            </div>
          </div>
        </div>

        <!-- 4-Table Navigation Tabs & Toolbar -->
        <div class="bg-[#141414] border border-[#242424] rounded-t-lg p-3 sm:p-4 mb-0 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <!-- 4 Table Selection Tabs -->
          <div class="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <!-- Customer Tab Button -->
            <button 
              (click)="activeTab = 'ROLE_CUSTOMER'"
              class="px-3.5 py-2 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
              [ngClass]="activeTab === 'ROLE_CUSTOMER' ? 'bg-gold text-black shadow-md' : 'text-neutral-400 hover:text-white hover:bg-[#1f1f1f]'">
              <i class="fa-solid fa-user text-[11px]"></i>
              <span>Customer Table</span>
              <span class="px-1.5 py-0.5 rounded text-[10px] font-extrabold" [ngClass]="activeTab === 'ROLE_CUSTOMER' ? 'bg-black/30 text-black' : 'bg-[#222222] text-neutral-300'">
                {{ customersCount }}
              </span>
            </button>

            <!-- Restaurant Tab Button -->
            <button 
              (click)="activeTab = 'ROLE_RESTAURANT_OWNER'"
              class="px-3.5 py-2 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
              [ngClass]="activeTab === 'ROLE_RESTAURANT_OWNER' ? 'bg-purple-600 text-white shadow-md' : 'text-neutral-400 hover:text-white hover:bg-[#1f1f1f]'">
              <i class="fa-solid fa-store text-[11px]"></i>
              <span>Restaurant Table</span>
              <span class="px-1.5 py-0.5 rounded text-[10px] font-extrabold" [ngClass]="activeTab === 'ROLE_RESTAURANT_OWNER' ? 'bg-black/30 text-white' : 'bg-[#222222] text-neutral-300'">
                {{ restaurantsCount }}
              </span>
            </button>

            <!-- Delivery Hub Tab Button -->
            <button 
              (click)="activeTab = 'ROLE_DELIVERY_PARTNER'"
              class="px-3.5 py-2 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
              [ngClass]="activeTab === 'ROLE_DELIVERY_PARTNER' ? 'bg-blue-600 text-white shadow-md' : 'text-neutral-400 hover:text-white hover:bg-[#1f1f1f]'">
              <i class="fa-solid fa-motorcycle text-[11px]"></i>
              <span>Delivery Hub Table</span>
              <span class="px-1.5 py-0.5 rounded text-[10px] font-extrabold" [ngClass]="activeTab === 'ROLE_DELIVERY_PARTNER' ? 'bg-black/30 text-white' : 'bg-[#222222] text-neutral-300'">
                {{ couriersCount }}
              </span>
            </button>

            <!-- Admin Tab Button -->
            <button 
              (click)="activeTab = 'ROLE_ADMIN'"
              class="px-3.5 py-2 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
              [ngClass]="activeTab === 'ROLE_ADMIN' ? 'bg-emerald-600 text-white shadow-md' : 'text-neutral-400 hover:text-white hover:bg-[#1f1f1f]'">
              <i class="fa-solid fa-shield-halved text-[11px]"></i>
              <span>Admin Table</span>
              <span class="px-1.5 py-0.5 rounded text-[10px] font-extrabold" [ngClass]="activeTab === 'ROLE_ADMIN' ? 'bg-black/30 text-white' : 'bg-[#222222] text-neutral-300'">
                {{ adminsCount }}
              </span>
            </button>

            <!-- View All 4 Tables -->
            <button 
              (click)="activeTab = 'ALL'"
              class="px-3.5 py-2 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer border"
              [ngClass]="activeTab === 'ALL' ? 'border-gold text-gold bg-gold/10' : 'border-[#2c2c2c] text-neutral-400 hover:text-white hover:bg-[#1f1f1f]'">
              <i class="fa-solid fa-table-cells text-[11px]"></i>
              <span>All 4 Tables View</span>
            </button>
          </div>

          <!-- Search & Status Filter Toolbar -->
          <div class="flex flex-wrap items-center gap-2.5">
            <!-- Account Status Filter -->
            <div class="relative min-w-[140px]">
              <select 
                [(ngModel)]="selectedStatusFilter" 
                class="w-full pl-3 pr-7 py-1.5 bg-[#0e0e0e] border border-[#2a2a2a] rounded text-xs text-white focus:outline-none focus:border-gold transition-colors appearance-none cursor-pointer font-semibold uppercase tracking-wider">
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active Only</option>
                <option value="SUSPENDED">Suspended Only</option>
              </select>
              <i class="fa-solid fa-chevron-down absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 text-[10px] pointer-events-none"></i>
            </div>

            <!-- Verification Filter -->
            <div class="relative min-w-[140px]">
              <select 
                [(ngModel)]="selectedVerificationFilter" 
                class="w-full pl-3 pr-7 py-1.5 bg-[#0e0e0e] border border-[#2a2a2a] rounded text-xs text-white focus:outline-none focus:border-gold transition-colors appearance-none cursor-pointer font-semibold uppercase tracking-wider">
                <option value="ALL">All Verification</option>
                <option value="VERIFIED">Verified Only</option>
                <option value="UNVERIFIED">Pending OTP</option>
              </select>
              <i class="fa-solid fa-chevron-down absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 text-[10px] pointer-events-none"></i>
            </div>

            <!-- Search Input -->
            <div class="relative min-w-[200px] sm:w-64">
              <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-xs"></i>
              <input 
                type="text" 
                [(ngModel)]="searchQuery" 
                placeholder="Search name, email, phone..." 
                class="w-full pl-8 pr-7 py-1.5 bg-[#0e0e0e] border border-[#2a2a2a] rounded text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-gold transition-colors" />
              <button 
                *ngIf="searchQuery" 
                (click)="searchQuery = ''" 
                class="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white text-xs">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Feedback Alert Banner -->
        <div *ngIf="feedbackMessage" 
             class="p-4 bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs flex items-center justify-between gap-4 animate-fadeIn">
          <div class="flex items-center gap-2.5">
            <i class="fa-solid fa-circle-check text-sm"></i>
            <span class="font-bold">{{ feedbackMessage }}</span>
          </div>
          <button (click)="feedbackMessage = ''" class="text-emerald-400 hover:text-white text-xs cursor-pointer">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="bg-[#141414] border border-[#242424] rounded-b-lg p-20 text-center mb-8">
          <div class="w-10 h-10 border-2 border-neutral-700 border-t-gold rounded-full animate-spin mx-auto mb-4"></div>
          <h3 class="text-base font-bold text-white mb-1">Retrieving User Accounts</h3>
          <p class="text-xs text-neutral-400">Loading full user roster across Customer, Restaurant, Delivery Hub, and Admin roles...</p>
        </div>

        <!-- 4 DEDICATED TABLES CONTAINER -->
        <div *ngIf="!loading" class="space-y-8 mb-12">

          <!-- ========================================== -->
          <!-- TABLE 1: CUSTOMER TABLE (ROLE_CUSTOMER) -->
          <!-- ========================================== -->
          <div *ngIf="activeTab === 'ROLE_CUSTOMER' || activeTab === 'ALL'" 
               class="bg-[#141414] border border-[#242424] shadow-xl overflow-hidden"
               [ngClass]="activeTab === 'ALL' ? 'rounded-lg' : 'rounded-b-lg'">
            
            <!-- Table Header Bar -->
            <div class="p-4 sm:p-5 bg-[#0f0f0f] border-b border-[#242424] flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded bg-gold/15 text-gold border border-gold/30 flex items-center justify-center text-xs">
                  <i class="fa-solid fa-user"></i>
                </div>
                <div>
                  <h2 class="text-sm sm:text-base font-extrabold text-white tracking-wide uppercase flex items-center gap-2">
                    1. Customer Patrons Table
                    <span class="text-xs font-normal lowercase text-neutral-400">({{ filteredCustomers.length }} records)</span>
                  </h2>
                  <p class="text-[11px] text-neutral-500">Retail clients ordering food delivery and restaurant dining.</p>
                </div>
              </div>
              <span class="text-[11px] font-bold text-gold px-2.5 py-1 bg-gold/10 border border-gold/20 rounded">
                ROLE_CUSTOMER
              </span>
            </div>

            <!-- Table Body -->
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="border-b border-[#242424] text-neutral-400 font-bold uppercase tracking-wider bg-[#111111]">
                    <th class="p-4">Customer Patron</th>
                    <th class="p-4">Contact Info</th>
                    <th class="p-4 text-center">Security Verification</th>
                    <th class="p-4 text-center">Account Status</th>
                    <th class="p-4 text-right">Governance Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[#1e1e1e]">
                  <tr *ngFor="let u of filteredCustomers" class="hover:bg-[#181818] transition-colors">
                    <!-- Patron -->
                    <td class="p-4">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded bg-gold/20 border border-gold/40 text-gold flex items-center justify-center font-bold text-xs shrink-0">
                          {{ getUserInitials(u.fullName) }}
                        </div>
                        <div>
                          <strong class="text-white block text-sm">{{ u.fullName }}</strong>
                          <span class="text-[10px] text-neutral-500 font-mono">UID #{{ u.id }}</span>
                        </div>
                      </div>
                    </td>

                    <!-- Contact -->
                    <td class="p-4">
                      <span class="text-neutral-300 block font-mono text-[11px]">{{ u.email }}</span>
                      <span *ngIf="u.phone" class="text-neutral-500 text-[10px] block">{{ u.phone }}</span>
                      <span *ngIf="!u.phone" class="text-neutral-600 text-[10px] italic">No phone attached</span>
                    </td>

                    <!-- Verification -->
                    <td class="p-4 text-center">
                      <span *ngIf="u.isVerified" class="text-emerald-400 font-bold inline-flex items-center gap-1.5 text-[11px]">
                        <i class="fa-solid fa-circle-check"></i> OTP Verified
                      </span>
                      <span *ngIf="!u.isVerified" class="text-neutral-500 inline-flex items-center gap-1.5 text-[11px]">
                        <i class="fa-solid fa-clock"></i> Pending OTP
                      </span>
                    </td>

                    <!-- Status -->
                    <td class="p-4 text-center">
                      <span class="px-2.5 py-1 text-[10px] font-extrabold tracking-wider rounded uppercase border inline-flex items-center"
                            [ngClass]="u.isActive ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400' : 'bg-rose-950/60 border-rose-500/40 text-rose-400'">
                        <span class="inline-block w-1.5 h-1.5 rounded-full mr-1.5" [ngClass]="u.isActive ? 'bg-emerald-400' : 'bg-rose-500'"></span>
                        {{ u.isActive ? 'ACTIVE' : 'SUSPENDED' }}
                      </span>
                    </td>

                    <!-- Actions -->
                    <td class="p-4 text-right">
                      <div class="flex items-center justify-end gap-2">
                        <button (click)="openDetailModal(u)" 
                                class="px-2.5 py-1 text-[11px] font-bold rounded border border-neutral-700 hover:border-white text-neutral-300 hover:text-white transition-all cursor-pointer">
                          <i class="fa-solid fa-eye mr-1"></i> Details
                        </button>

                        <button (click)="toggleActive(u.id)" 
                                class="px-3 py-1 text-[11px] font-bold rounded border transition-all cursor-pointer"
                                [ngClass]="u.isActive ? 'bg-rose-950/60 border-rose-500/40 text-rose-400 hover:bg-rose-500 hover:text-white' : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500 hover:text-black'">
                          <i class="fa-solid" [ngClass]="u.isActive ? 'fa-ban' : 'fa-check'"></i>
                          <span class="ml-1">{{ u.isActive ? 'Suspend' : 'Reactivate' }}</span>
                        </button>
                      </div>
                    </td>
                  </tr>

                  <!-- Empty Row State -->
                  <tr *ngIf="filteredCustomers.length === 0">
                    <td colspan="5" class="p-8 text-center text-neutral-500 text-xs">
                      No customer accounts matching current criteria.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>


          <!-- ========================================================== -->
          <!-- TABLE 2: RESTAURANT TABLE (ROLE_RESTAURANT_OWNER) -->
          <!-- ========================================================== -->
          <div *ngIf="activeTab === 'ROLE_RESTAURANT_OWNER' || activeTab === 'ALL'" 
               class="bg-[#141414] border border-[#242424] shadow-xl overflow-hidden"
               [ngClass]="activeTab === 'ALL' ? 'rounded-lg' : 'rounded-b-lg'">
            
            <!-- Table Header Bar -->
            <div class="p-4 sm:p-5 bg-[#0f0f0f] border-b border-[#242424] flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded bg-purple-950/60 text-purple-400 border border-purple-500/40 flex items-center justify-center text-xs">
                  <i class="fa-solid fa-store"></i>
                </div>
                <div>
                  <h2 class="text-sm sm:text-base font-extrabold text-white tracking-wide uppercase flex items-center gap-2">
                    2. Restaurant Table
                    <span class="text-xs font-normal lowercase text-neutral-400">({{ filteredRestaurants.length }} records)</span>
                  </h2>
                  <p class="text-[11px] text-neutral-500">Culinary proprietors and restaurant merchant account administrators.</p>
                </div>
              </div>
              <span class="text-[11px] font-bold text-purple-400 px-2.5 py-1 bg-purple-950/60 border border-purple-500/30 rounded">
                ROLE_RESTAURANT_OWNER
              </span>
            </div>

            <!-- Table Body -->
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="border-b border-[#242424] text-neutral-400 font-bold uppercase tracking-wider bg-[#111111]">
                    <th class="p-4">Proprietor / Merchant</th>
                    <th class="p-4">Contact Info</th>
                    <th class="p-4">Linked Restaurant Venue</th>
                    <th class="p-4 text-center">Security Verification</th>
                    <th class="p-4 text-center">Account Status</th>
                    <th class="p-4 text-right">Governance Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[#1e1e1e]">
                  <tr *ngFor="let u of filteredRestaurants" class="hover:bg-[#181818] transition-colors">
                    <!-- Owner -->
                    <td class="p-4">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded bg-purple-950/60 border border-purple-500/40 text-purple-300 flex items-center justify-center font-bold text-xs shrink-0">
                          {{ getUserInitials(u.fullName) }}
                        </div>
                        <div>
                          <strong class="text-white block text-sm">{{ u.fullName }}</strong>
                          <span class="text-[10px] text-neutral-500 font-mono">UID #{{ u.id }}</span>
                        </div>
                      </div>
                    </td>

                    <!-- Contact -->
                    <td class="p-4">
                      <span class="text-neutral-300 block font-mono text-[11px]">{{ u.email }}</span>
                      <span *ngIf="u.phone" class="text-neutral-500 text-[10px] block">{{ u.phone }}</span>
                      <span *ngIf="!u.phone" class="text-neutral-600 text-[10px] italic">No phone attached</span>
                    </td>

                    <!-- Linked Restaurant -->
                    <td class="p-4">
                      <div class="flex items-center gap-2">
                        <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-[#1c1c1c] border border-neutral-700 text-neutral-300 flex items-center gap-1.5">
                          <i class="fa-solid fa-utensils text-gold text-[9px]"></i>
                          {{ getRestaurantName(u) }}
                        </span>
                      </div>
                    </td>

                    <!-- Verification -->
                    <td class="p-4 text-center">
                      <span *ngIf="u.isVerified" class="text-emerald-400 font-bold inline-flex items-center gap-1.5 text-[11px]">
                        <i class="fa-solid fa-circle-check"></i> OTP Verified
                      </span>
                      <span *ngIf="!u.isVerified" class="text-neutral-500 inline-flex items-center gap-1.5 text-[11px]">
                        <i class="fa-solid fa-clock"></i> Pending OTP
                      </span>
                    </td>

                    <!-- Status -->
                    <td class="p-4 text-center">
                      <span class="px-2.5 py-1 text-[10px] font-extrabold tracking-wider rounded uppercase border inline-flex items-center"
                            [ngClass]="u.isActive ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400' : 'bg-rose-950/60 border-rose-500/40 text-rose-400'">
                        <span class="inline-block w-1.5 h-1.5 rounded-full mr-1.5" [ngClass]="u.isActive ? 'bg-emerald-400' : 'bg-rose-500'"></span>
                        {{ u.isActive ? 'ACTIVE' : 'SUSPENDED' }}
                      </span>
                    </td>

                    <!-- Actions -->
                    <td class="p-4 text-right">
                      <div class="flex items-center justify-end gap-2">
                        <button (click)="openDetailModal(u)" 
                                class="px-2.5 py-1 text-[11px] font-bold rounded border border-neutral-700 hover:border-white text-neutral-300 hover:text-white transition-all cursor-pointer">
                          <i class="fa-solid fa-eye mr-1"></i> Details
                        </button>

                        <button (click)="toggleActive(u.id)" 
                                class="px-3 py-1 text-[11px] font-bold rounded border transition-all cursor-pointer"
                                [ngClass]="u.isActive ? 'bg-rose-950/60 border-rose-500/40 text-rose-400 hover:bg-rose-500 hover:text-white' : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500 hover:text-black'">
                          <i class="fa-solid" [ngClass]="u.isActive ? 'fa-ban' : 'fa-check'"></i>
                          <span class="ml-1">{{ u.isActive ? 'Suspend' : 'Reactivate' }}</span>
                        </button>
                      </div>
                    </td>
                  </tr>

                  <!-- Empty Row State -->
                  <tr *ngIf="filteredRestaurants.length === 0">
                    <td colspan="6" class="p-8 text-center text-neutral-500 text-xs">
                      No restaurant accounts matching current criteria.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>


          <!-- ========================================================== -->
          <!-- TABLE 3: DELIVERY HUB TABLE (ROLE_DELIVERY_PARTNER) -->
          <!-- ========================================================== -->
          <div *ngIf="activeTab === 'ROLE_DELIVERY_PARTNER' || activeTab === 'ALL'" 
               class="bg-[#141414] border border-[#242424] shadow-xl overflow-hidden"
               [ngClass]="activeTab === 'ALL' ? 'rounded-lg' : 'rounded-b-lg'">
            
            <!-- Table Header Bar -->
            <div class="p-4 sm:p-5 bg-[#0f0f0f] border-b border-[#242424] flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded bg-blue-950/60 text-blue-400 border border-blue-500/40 flex items-center justify-center text-xs">
                  <i class="fa-solid fa-motorcycle"></i>
                </div>
                <div>
                  <h2 class="text-sm sm:text-base font-extrabold text-white tracking-wide uppercase flex items-center gap-2">
                    3. Delivery Hub Table
                    <span class="text-xs font-normal lowercase text-neutral-400">({{ filteredCouriers.length }} records)</span>
                  </h2>
                  <p class="text-[11px] text-neutral-500">Fleet couriers, dispatch drivers, and transit delivery partners.</p>
                </div>
              </div>
              <span class="text-[11px] font-bold text-blue-400 px-2.5 py-1 bg-blue-950/60 border border-blue-500/30 rounded">
                ROLE_DELIVERY_PARTNER
              </span>
            </div>

            <!-- Table Body -->
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="border-b border-[#242424] text-neutral-400 font-bold uppercase tracking-wider bg-[#111111]">
                    <th class="p-4">Courier Partner</th>
                    <th class="p-4">Contact Info</th>
                    <th class="p-4">Fleet Status</th>
                    <th class="p-4 text-center">Security Verification</th>
                    <th class="p-4 text-center">Account Status</th>
                    <th class="p-4 text-right">Governance Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[#1e1e1e]">
                  <tr *ngFor="let u of filteredCouriers" class="hover:bg-[#181818] transition-colors">
                    <!-- Courier -->
                    <td class="p-4">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded bg-blue-950/60 border border-blue-500/40 text-blue-300 flex items-center justify-center font-bold text-xs shrink-0">
                          {{ getUserInitials(u.fullName) }}
                        </div>
                        <div>
                          <strong class="text-white block text-sm">{{ u.fullName }}</strong>
                          <span class="text-[10px] text-neutral-500 font-mono">UID #{{ u.id }}</span>
                        </div>
                      </div>
                    </td>

                    <!-- Contact -->
                    <td class="p-4">
                      <span class="text-neutral-300 block font-mono text-[11px]">{{ u.email }}</span>
                      <span *ngIf="u.phone" class="text-neutral-500 text-[10px] block">{{ u.phone }}</span>
                      <span *ngIf="!u.phone" class="text-neutral-600 text-[10px] italic">No phone attached</span>
                    </td>

                    <!-- Fleet Status -->
                    <td class="p-4">
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950/40 border border-blue-500/30 text-blue-300 inline-flex items-center gap-1.5">
                        <i class="fa-solid fa-route text-[9px]"></i> Dispatch Hub Courier
                      </span>
                    </td>

                    <!-- Verification -->
                    <td class="p-4 text-center">
                      <span *ngIf="u.isVerified" class="text-emerald-400 font-bold inline-flex items-center gap-1.5 text-[11px]">
                        <i class="fa-solid fa-circle-check"></i> OTP Verified
                      </span>
                      <span *ngIf="!u.isVerified" class="text-neutral-500 inline-flex items-center gap-1.5 text-[11px]">
                        <i class="fa-solid fa-clock"></i> Pending OTP
                      </span>
                    </td>

                    <!-- Status -->
                    <td class="p-4 text-center">
                      <span class="px-2.5 py-1 text-[10px] font-extrabold tracking-wider rounded uppercase border inline-flex items-center"
                            [ngClass]="u.isActive ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400' : 'bg-rose-950/60 border-rose-500/40 text-rose-400'">
                        <span class="inline-block w-1.5 h-1.5 rounded-full mr-1.5" [ngClass]="u.isActive ? 'bg-emerald-400' : 'bg-rose-500'"></span>
                        {{ u.isActive ? 'ACTIVE' : 'SUSPENDED' }}
                      </span>
                    </td>

                    <!-- Actions -->
                    <td class="p-4 text-right">
                      <div class="flex items-center justify-end gap-2">
                        <button (click)="openDetailModal(u)" 
                                class="px-2.5 py-1 text-[11px] font-bold rounded border border-neutral-700 hover:border-white text-neutral-300 hover:text-white transition-all cursor-pointer">
                          <i class="fa-solid fa-eye mr-1"></i> Details
                        </button>

                        <button (click)="toggleActive(u.id)" 
                                class="px-3 py-1 text-[11px] font-bold rounded border transition-all cursor-pointer"
                                [ngClass]="u.isActive ? 'bg-rose-950/60 border-rose-500/40 text-rose-400 hover:bg-rose-500 hover:text-white' : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500 hover:text-black'">
                          <i class="fa-solid" [ngClass]="u.isActive ? 'fa-ban' : 'fa-check'"></i>
                          <span class="ml-1">{{ u.isActive ? 'Suspend' : 'Reactivate' }}</span>
                        </button>
                      </div>
                    </td>
                  </tr>

                  <!-- Empty Row State -->
                  <tr *ngIf="filteredCouriers.length === 0">
                    <td colspan="6" class="p-8 text-center text-neutral-500 text-xs">
                      No delivery couriers matching current criteria.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>


          <!-- ========================================================== -->
          <!-- TABLE 4: ADMIN TABLE (ROLE_ADMIN) -->
          <!-- ========================================================== -->
          <div *ngIf="activeTab === 'ROLE_ADMIN' || activeTab === 'ALL'" 
               class="bg-[#141414] border border-[#242424] shadow-xl overflow-hidden"
               [ngClass]="activeTab === 'ALL' ? 'rounded-lg' : 'rounded-b-lg'">
            
            <!-- Table Header Bar -->
            <div class="p-4 sm:p-5 bg-[#0f0f0f] border-b border-[#242424] flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-xs">
                  <i class="fa-solid fa-shield-halved"></i>
                </div>
                <div>
                  <h2 class="text-sm sm:text-base font-extrabold text-white tracking-wide uppercase flex items-center gap-2">
                    4. Admin Table
                    <span class="text-xs font-normal lowercase text-neutral-400">({{ filteredAdmins.length }} records)</span>
                  </h2>
                  <p class="text-[11px] text-neutral-500">Super administrators and executive platform security officers.</p>
                </div>
              </div>
              <span class="text-[11px] font-bold text-emerald-400 px-2.5 py-1 bg-emerald-950/60 border border-emerald-500/30 rounded">
                ROLE_ADMIN
              </span>
            </div>

            <!-- Table Body -->
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="border-b border-[#242424] text-neutral-400 font-bold uppercase tracking-wider bg-[#111111]">
                    <th class="p-4">Administrator</th>
                    <th class="p-4">Contact Info</th>
                    <th class="p-4">Clearance Level</th>
                    <th class="p-4 text-center">Security Verification</th>
                    <th class="p-4 text-center">Account Status</th>
                    <th class="p-4 text-right">Governance Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[#1e1e1e]">
                  <tr *ngFor="let u of filteredAdmins" class="hover:bg-[#181818] transition-colors">
                    <!-- Admin -->
                    <td class="p-4">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0">
                          {{ getUserInitials(u.fullName) }}
                        </div>
                        <div>
                          <strong class="text-white block text-sm">{{ u.fullName }}</strong>
                          <span class="text-[10px] text-neutral-500 font-mono">UID #{{ u.id }}</span>
                        </div>
                      </div>
                    </td>

                    <!-- Contact -->
                    <td class="p-4">
                      <span class="text-neutral-300 block font-mono text-[11px]">{{ u.email }}</span>
                      <span *ngIf="u.phone" class="text-neutral-500 text-[10px] block">{{ u.phone }}</span>
                      <span *ngIf="!u.phone" class="text-neutral-600 text-[10px] italic">No phone attached</span>
                    </td>

                    <!-- Clearance -->
                    <td class="p-4">
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 inline-flex items-center gap-1.5">
                        <i class="fa-solid fa-key text-[9px]"></i> Tier-1 Super Admin Clearance
                      </span>
                    </td>

                    <!-- Verification -->
                    <td class="p-4 text-center">
                      <span *ngIf="u.isVerified" class="text-emerald-400 font-bold inline-flex items-center gap-1.5 text-[11px]">
                        <i class="fa-solid fa-circle-check"></i> OTP Verified
                      </span>
                      <span *ngIf="!u.isVerified" class="text-neutral-500 inline-flex items-center gap-1.5 text-[11px]">
                        <i class="fa-solid fa-clock"></i> Pending OTP
                      </span>
                    </td>

                    <!-- Status -->
                    <td class="p-4 text-center">
                      <span class="px-2.5 py-1 text-[10px] font-extrabold tracking-wider rounded uppercase border inline-flex items-center"
                            [ngClass]="u.isActive ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400' : 'bg-rose-950/60 border-rose-500/40 text-rose-400'">
                        <span class="inline-block w-1.5 h-1.5 rounded-full mr-1.5" [ngClass]="u.isActive ? 'bg-emerald-400' : 'bg-rose-500'"></span>
                        {{ u.isActive ? 'ACTIVE' : 'SUSPENDED' }}
                      </span>
                    </td>

                    <!-- Actions -->
                    <td class="p-4 text-right">
                      <div class="flex items-center justify-end gap-2">
                        <button (click)="openDetailModal(u)" 
                                class="px-2.5 py-1 text-[11px] font-bold rounded border border-neutral-700 hover:border-white text-neutral-300 hover:text-white transition-all cursor-pointer">
                          <i class="fa-solid fa-eye mr-1"></i> Details
                        </button>

                        <button (click)="toggleActive(u.id)" 
                                class="px-3 py-1 text-[11px] font-bold rounded border transition-all cursor-pointer"
                                [ngClass]="u.isActive ? 'bg-rose-950/60 border-rose-500/40 text-rose-400 hover:bg-rose-500 hover:text-white' : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500 hover:text-black'">
                          <i class="fa-solid" [ngClass]="u.isActive ? 'fa-ban' : 'fa-check'"></i>
                          <span class="ml-1">{{ u.isActive ? 'Suspend' : 'Reactivate' }}</span>
                        </button>
                      </div>
                    </td>
                  </tr>

                  <!-- Empty Row State -->
                  <tr *ngIf="filteredAdmins.length === 0">
                    <td colspan="6" class="p-8 text-center text-neutral-500 text-xs">
                      No administrator accounts matching current criteria.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        <!-- Detail Inspection Modal -->
        <div *ngIf="inspectingUser" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div class="bg-[#141414] border border-[#242424] rounded-lg max-w-lg w-full p-6 sm:p-8 shadow-2xl">
            <div class="flex justify-between items-start pb-4 border-b border-[#242424] mb-6">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-full bg-gold/20 border border-gold/40 text-gold font-bold flex items-center justify-center text-base">
                  {{ getUserInitials(inspectingUser.fullName) }}
                </div>
                <div>
                  <h3 class="text-lg font-extrabold text-white">{{ inspectingUser.fullName }}</h3>
                  <p class="text-xs text-neutral-400">{{ inspectingUser.email }}</p>
                </div>
              </div>
              <button (click)="inspectingUser = null" class="text-neutral-500 hover:text-white text-base cursor-pointer">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div class="space-y-4 text-xs">
              <div class="grid grid-cols-2 gap-4 p-4 rounded bg-[#0d0d0d] border border-[#202020]">
                <div>
                  <span class="text-neutral-500 uppercase block font-bold text-[10px]">User Identifier</span>
                  <span class="text-white font-mono font-bold">UID #{{ inspectingUser.id }}</span>
                </div>
                <div>
                  <span class="text-neutral-500 uppercase block font-bold text-[10px]">Platform Role</span>
                  <span class="text-gold font-bold">{{ inspectingUser.role.replace('ROLE_', '').replace('_', ' ') }}</span>
                </div>
                <div>
                  <span class="text-neutral-500 uppercase block font-bold text-[10px]">Verification Status</span>
                  <span class="font-bold" [ngClass]="inspectingUser.isVerified ? 'text-emerald-400' : 'text-neutral-500'">
                    {{ inspectingUser.isVerified ? 'Verified Account' : 'Pending OTP Verification' }}
                  </span>
                </div>
                <div>
                  <span class="text-neutral-500 uppercase block font-bold text-[10px]">Governance Status</span>
                  <span class="font-bold" [ngClass]="inspectingUser.isActive ? 'text-emerald-400' : 'text-rose-400'">
                    {{ inspectingUser.isActive ? 'Active (Good Standing)' : 'Suspended' }}
                  </span>
                </div>
              </div>

              <div *ngIf="inspectingUser.phone" class="p-3 bg-[#0d0d0d] border border-[#202020] rounded">
                <span class="text-neutral-500 uppercase block font-bold text-[10px]">Primary Contact Phone</span>
                <span class="text-white font-mono">{{ inspectingUser.phone }}</span>
              </div>

              <div *ngIf="inspectingUser.role === 'ROLE_RESTAURANT_OWNER'" class="p-3 bg-[#0d0d0d] border border-[#202020] rounded">
                <span class="text-neutral-500 uppercase block font-bold text-[10px]">Venue Association</span>
                <span class="text-purple-300 font-bold">{{ getRestaurantName(inspectingUser) }}</span>
              </div>
            </div>

            <div class="mt-6 pt-4 border-t border-[#242424] flex items-center justify-between">
              <button (click)="toggleActive(inspectingUser.id)" 
                      class="px-4 py-2 font-extrabold text-xs uppercase tracking-wider rounded border transition-all cursor-pointer"
                      [ngClass]="inspectingUser.isActive ? 'bg-rose-950/60 border-rose-500/40 text-rose-400 hover:bg-rose-500 hover:text-white' : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500 hover:text-black'">
                {{ inspectingUser.isActive ? 'Suspend User Access' : 'Reactivate User Account' }}
              </button>

              <button (click)="inspectingUser = null" 
                      class="px-4 py-2 border border-neutral-700 hover:border-white text-neutral-300 hover:text-white rounded text-xs font-bold uppercase tracking-wider transition-all cursor-pointer">
                Close
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  `
})
export class AdminCustomersComponent implements OnInit {
  users: User[] = [];
  restaurantsList: Restaurant[] = [];
  loading = false;
  feedbackMessage = '';
  inspectingUser: User | null = null;

  activeTab: UserTab = 'ROLE_CUSTOMER';
  selectedStatusFilter = 'ALL';
  selectedVerificationFilter = 'ALL';
  searchQuery = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.adminService.getUsers().subscribe({
      next: res => {
        this.loading = false;
        if (res.success && res.data) {
          this.users = res.data;
        }
      },
      error: () => {
        this.loading = false;
      }
    });

    this.adminService.getAllRestaurants().subscribe({
      next: res => {
        if (res.success && res.data) {
          this.restaurantsList = res.data;
        }
      }
    });
  }

  get customersCount(): number {
    return this.users.filter(u => u.role === 'ROLE_CUSTOMER').length;
  }

  get restaurantsCount(): number {
    return this.users.filter(u => u.role === 'ROLE_RESTAURANT_OWNER').length;
  }

  get couriersCount(): number {
    return this.users.filter(u => u.role === 'ROLE_DELIVERY_PARTNER').length;
  }

  get adminsCount(): number {
    return this.users.filter(u => u.role === 'ROLE_ADMIN').length;
  }

  get activeUsersCount(): number {
    return this.users.filter(u => u.isActive).length;
  }

  getActiveCountByRole(role: Role): number {
    return this.users.filter(u => u.role === role && u.isActive).length;
  }

  getVerifiedCountByRole(role: Role): number {
    return this.users.filter(u => u.role === role && u.isVerified).length;
  }

  getUserInitials(name?: string): string {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  getRestaurantName(user: User): string {
    if (user.restaurantId) {
      const match = this.restaurantsList.find(r => r.id === user.restaurantId);
      if (match) return match.name;
    }
    const matchByEmail = this.restaurantsList.find(r => r.email === user.email);
    if (matchByEmail) return matchByEmail.name;
    return 'Assigned Partner';
  }

  private filterList(list: User[]): User[] {
    return list.filter(u => {
      // Status filter
      if (this.selectedStatusFilter === 'ACTIVE' && !u.isActive) return false;
      if (this.selectedStatusFilter === 'SUSPENDED' && u.isActive) return false;

      // Verification filter
      if (this.selectedVerificationFilter === 'VERIFIED' && !u.isVerified) return false;
      if (this.selectedVerificationFilter === 'UNVERIFIED' && u.isVerified) return false;

      // Search query
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        const matchesName = u.fullName?.toLowerCase().includes(q);
        const matchesEmail = u.email?.toLowerCase().includes(q);
        const matchesPhone = u.phone?.toLowerCase().includes(q);
        const matchesId = u.id?.toString().includes(q);
        if (!matchesName && !matchesEmail && !matchesPhone && !matchesId) return false;
      }
      return true;
    });
  }

  get filteredCustomers(): User[] {
    return this.filterList(this.users.filter(u => u.role === 'ROLE_CUSTOMER'));
  }

  get filteredRestaurants(): User[] {
    return this.filterList(this.users.filter(u => u.role === 'ROLE_RESTAURANT_OWNER'));
  }

  get filteredCouriers(): User[] {
    return this.filterList(this.users.filter(u => u.role === 'ROLE_DELIVERY_PARTNER'));
  }

  get filteredAdmins(): User[] {
    return this.filterList(this.users.filter(u => u.role === 'ROLE_ADMIN'));
  }

  openDetailModal(user: User): void {
    this.inspectingUser = user;
  }

  toggleActive(userId: number): void {
    this.adminService.toggleUserActive(userId).subscribe({
      next: res => {
        const newStatus = res.data?.isActive ? 'Active' : 'Suspended';
        this.feedbackMessage = `User account updated to ${newStatus}.`;
        if (this.inspectingUser && this.inspectingUser.id === userId) {
          this.inspectingUser = { ...this.inspectingUser, isActive: res.data?.isActive ?? !this.inspectingUser.isActive };
        }
        this.loadData();
        setTimeout(() => {
          this.feedbackMessage = '';
        }, 5000);
      }
    });
  }
}
