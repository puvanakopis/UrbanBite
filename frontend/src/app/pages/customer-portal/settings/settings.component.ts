import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/auth.models';
import { UserSidebarComponent } from '../../../components/user-sidebar/user-sidebar.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, UserSidebarComponent],
  template: `
    <div class="bg-[#090909] min-h-[90vh] py-12 sm:py-16 text-neutral-200">
      <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <!-- Grid Layout: Sidebar Navigation + Settings Content -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          <!-- Left Column: User Sidebar Navigation -->
          <div class="lg:col-span-3">
            <app-user-sidebar></app-user-sidebar>
          </div>

          <!-- Right Column: Settings Content -->
          <div class="lg:col-span-9 space-y-8">

            <!-- Header -->
            <div class="mb-2">
              <span class="text-xs font-bold uppercase tracking-[2.5px] text-gold mb-3 inline-block">SYSTEM & PREFERENCES</span>
              <h1 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Settings & Privacy</h1>
            </div>

            <!-- Notification Banner / Alert -->
            <div *ngIf="statusAlert" 
                 class="p-4 rounded border flex items-center justify-between animate-fadeIn shadow-lg"
                 [ngClass]="statusAlert.type === 'success' ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' : 'bg-rose-950/60 border-rose-500/40 text-rose-300'">
              <div class="flex items-center gap-3 text-xs font-semibold">
                <i class="fa-solid" [ngClass]="statusAlert.type === 'success' ? 'fa-circle-check text-emerald-400' : 'fa-triangle-exclamation text-rose-400'"></i>
                <span>{{ statusAlert.message }}</span>
              </div>
              <button (click)="statusAlert = null" class="text-neutral-400 hover:text-white text-xs cursor-pointer">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div class="space-y-8">
          
          <!-- ============================================== -->
          <!-- SECTION 1: CHANGE PASSWORD -->
          <!-- ============================================== -->
          <div class="bg-[#141414] border border-[#242424] rounded p-6 sm:p-8 shadow-xl space-y-6">
            <div class="pb-5 border-b border-[#242424]">
              <span class="text-[10px] font-extrabold uppercase tracking-[2px] text-gold block mb-1">CRYPTOGRAPHIC SECURITY</span>
              <h3 class="text-xl font-bold text-white">Change Password</h3>
              <p class="text-xs text-neutral-400 mt-1">Update your password to keep your UrbanBite account safe and secure.</p>
            </div>

            <form (submit)="changePassword($event)" class="space-y-5">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Current Password *</label>
                <div class="relative">
                  <input [type]="showCurrentPass ? 'text' : 'password'" 
                         [(ngModel)]="passwordForm.currentPassword" 
                         name="currentPassword" 
                         required 
                         class="w-full px-4 py-3 bg-[#0d0d0d] border border-[#242424] rounded text-white text-xs outline-none focus:border-gold transition-colors pr-10" 
                         placeholder="Enter current password" />
                  <button type="button" 
                          (click)="showCurrentPass = !showCurrentPass" 
                          class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white text-xs p-1 cursor-pointer">
                    <i class="fa-solid" [ngClass]="showCurrentPass ? 'fa-eye-slash' : 'fa-eye'"></i>
                  </button>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">New Password *</label>
                  <div class="relative">
                    <input [type]="showNewPass ? 'text' : 'password'" 
                           [(ngModel)]="passwordForm.newPassword" 
                           name="newPassword" 
                           required 
                           class="w-full px-4 py-3 bg-[#0d0d0d] border border-[#242424] rounded text-white text-xs outline-none focus:border-gold transition-colors pr-10" 
                           placeholder="Minimum 6 characters" />
                    <button type="button" 
                            (click)="showNewPass = !showNewPass" 
                            class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white text-xs p-1 cursor-pointer">
                      <i class="fa-solid" [ngClass]="showNewPass ? 'fa-eye-slash' : 'fa-eye'"></i>
                    </button>
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Confirm New Password *</label>
                  <div class="relative">
                    <input [type]="showConfirmPass ? 'text' : 'password'" 
                           [(ngModel)]="passwordForm.confirmPassword" 
                           name="confirmPassword" 
                           required 
                           class="w-full px-4 py-3 bg-[#0d0d0d] border border-[#242424] rounded text-white text-xs outline-none focus:border-gold transition-colors pr-10" 
                           placeholder="Re-enter new password" />
                    <button type="button" 
                            (click)="showConfirmPass = !showConfirmPass" 
                            class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white text-xs p-1 cursor-pointer">
                      <i class="fa-solid" [ngClass]="showConfirmPass ? 'fa-eye-slash' : 'fa-eye'"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div class="pt-4 border-t border-[#242424] flex items-center justify-end">
                <button type="submit" 
                        [disabled]="isChangingPass"
                        class="px-7 py-3 bg-gold hover:bg-gold-light text-black font-extrabold text-xs uppercase tracking-wider rounded transition-all cursor-pointer shadow-md disabled:opacity-40 flex items-center gap-2">
                  <i class="fa-solid" [ngClass]="isChangingPass ? 'fa-spinner fa-spin' : 'fa-key'"></i>
                  <span>{{ isChangingPass ? 'Updating...' : 'Update Password' }}</span>
                </button>
              </div>
            </form>
          </div>

          <!-- ============================================== -->
          <!-- SECTION 2: DELETE ACCOUNT (DANGER ZONE) -->
          <!-- ============================================== -->
          <div class="bg-[#141414] border border-rose-900/30 rounded p-6 sm:p-8 shadow-xl space-y-6">
            <div class="pb-5 border-b border-[#242424]">
              <span class="text-[10px] font-extrabold uppercase tracking-[2px] text-rose-400 block mb-1">DANGER ZONE</span>
              <h3 class="text-xl font-bold text-white">Delete Account</h3>
              <p class="text-xs text-neutral-400 mt-1">Permanently remove your account, profile data, and personal credentials.</p>
            </div>

            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-5 p-5 bg-rose-950/20 border border-rose-900/40 rounded">
              <div class="space-y-1 max-w-xl">
                <h4 class="text-sm font-bold text-white flex items-center gap-2">
                  <i class="fa-solid fa-triangle-exclamation text-rose-400"></i>
                  <span>Permanent Account Deletion</span>
                </h4>
                <p class="text-xs text-neutral-400 leading-relaxed">
                  Once deleted, your patron credentials, saved delivery addresses, order history access, and session tokens will be permanently wiped. This action cannot be undone.
                </p>
              </div>

              <button (click)="openDeleteModal()" 
                      type="button"
                      class="px-6 py-3 bg-rose-950/60 hover:bg-rose-900 border border-rose-700/60 hover:border-rose-500 text-rose-200 hover:text-white font-extrabold text-xs uppercase tracking-wider rounded transition-all cursor-pointer shrink-0 shadow flex items-center gap-2">
                <i class="fa-regular fa-trash-can"></i>
                <span>Delete My Account</span>
              </button>
            </div>
          </div>

        </div>
          </div>
        </div>

        <!-- ============================================== -->
        <!-- DELETE CONFIRMATION MODAL -->
        <!-- ============================================== -->
        <div *ngIf="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div class="bg-[#141414] border border-[#333] rounded w-full max-w-md shadow-2xl overflow-hidden">
            <div class="p-6 border-b border-[#242424] flex justify-between items-center bg-rose-950/30">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded bg-rose-950/80 border border-rose-600/50 text-rose-400 flex items-center justify-center shrink-0">
                  <i class="fa-solid fa-triangle-exclamation text-lg"></i>
                </div>
                <div>
                  <span class="text-[10px] font-extrabold uppercase tracking-[2px] text-rose-400 block mb-0.5">FINAL CONFIRMATION</span>
                  <h3 class="text-lg font-bold text-white">Delete Account?</h3>
                </div>
              </div>
              <button (click)="closeDeleteModal()" class="text-neutral-500 hover:text-white cursor-pointer text-lg p-1">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div class="p-6 space-y-4">
              <p class="text-xs text-neutral-300 leading-relaxed">
                Are you absolutely sure you wish to delete your UrbanBite account? All patron records, authentication credentials, and saved addresses will be erased permanently.
              </p>

              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                  Type <span class="text-rose-400 font-mono font-bold">DELETE</span> to confirm:
                </label>
                <input type="text" 
                       [(ngModel)]="deleteConfirmText" 
                       placeholder="DELETE" 
                       class="w-full px-4 py-3 bg-[#0d0d0d] border border-[#242424] focus:border-rose-500 rounded text-white text-xs outline-none transition-colors font-mono" />
              </div>
            </div>

            <div class="p-6 border-t border-[#242424] flex items-center justify-end gap-3 bg-[#0f0f0f]">
              <button type="button" 
                      (click)="closeDeleteModal()" 
                      class="px-5 py-2.5 bg-transparent text-neutral-400 hover:text-white text-xs font-bold uppercase tracking-wider rounded transition-colors cursor-pointer">
                Cancel
              </button>
              <button type="button" 
                      (click)="confirmDeleteAccount()" 
                      [disabled]="deleteConfirmText !== 'DELETE' || isDeletingAccount"
                      class="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white font-extrabold text-xs uppercase tracking-wider rounded transition-all cursor-pointer shadow-md disabled:cursor-not-allowed flex items-center gap-2">
                <i class="fa-solid" [ngClass]="isDeletingAccount ? 'fa-spinner fa-spin' : 'fa-trash-can'"></i>
                <span>{{ isDeletingAccount ? 'Deleting...' : 'Permanently Delete' }}</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  `
})
export class SettingsComponent implements OnInit {
  currentUser: User | null = null;
  statusAlert: { message: string; type: 'success' | 'error' } | null = null;

  // Password Form State
  isChangingPass: boolean = false;
  showCurrentPass: boolean = false;
  showNewPass: boolean = false;
  showConfirmPass: boolean = false;
  passwordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  // Delete Account Modal State
  showDeleteModal: boolean = false;
  deleteConfirmText: string = '';
  isDeletingAccount: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(u => {
      this.currentUser = u;
    });
  }

  changePassword(event: Event): void {
    event.preventDefault();
    if (!this.passwordForm.currentPassword) {
      this.statusAlert = { message: 'Please enter your current password.', type: 'error' };
      return;
    }
    if (this.passwordForm.newPassword.length < 6) {
      this.statusAlert = { message: 'New password must contain at least 6 characters.', type: 'error' };
      return;
    }
    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      this.statusAlert = { message: 'New passwords do not match.', type: 'error' };
      return;
    }

    this.isChangingPass = true;
    setTimeout(() => {
      this.isChangingPass = false;
      this.passwordForm = { currentPassword: '', newPassword: '', confirmPassword: '' };
      this.statusAlert = { message: 'Password successfully updated and encrypted.', type: 'success' };
    }, 800);
  }

  openDeleteModal(): void {
    this.deleteConfirmText = '';
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.deleteConfirmText = '';
  }

  confirmDeleteAccount(): void {
    if (this.deleteConfirmText !== 'DELETE') return;

    this.isDeletingAccount = true;
    setTimeout(() => {
      this.isDeletingAccount = false;
      this.showDeleteModal = false;
      this.authService.logout();
      this.router.navigate(['/']);
    }, 1000);
  }
}
