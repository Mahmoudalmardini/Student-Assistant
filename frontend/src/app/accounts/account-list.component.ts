import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AccountService, Account } from '../core/services/account.service';

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './account-list.component.html',
  styleUrl: './account-list.component.scss'
})
export class AccountListComponent implements OnInit {
  private accountService = inject(AccountService);
  private router = inject(Router);

  accounts: Account[] = [];
  displayedColumns: string[] = ['name', 'username', 'role', 'universityId', 'status', 'actions'];
  filteredAccounts: Account[] = [];
  isLoading = false;
  searchTerm = '';
  roleFilter = '';

  // Pagination
  pageSize = 10;
  pageIndex = 0;
  totalItems = 0;

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.isLoading = true;
    this.accountService.getAllAccounts().subscribe({
      next: (accounts) => {
        this.accounts = accounts;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading accounts:', error);
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.accounts];

    // Role filter
    if (this.roleFilter) {
      filtered = filtered.filter(acc => acc.role === this.roleFilter);
    }

    // Search filter
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(acc =>
        acc.firstName?.toLowerCase().includes(search) ||
        acc.lastName?.toLowerCase().includes(search) ||
        acc.username?.toLowerCase().includes(search) ||
        acc.universityId?.toLowerCase().includes(search) ||
        acc.email?.toLowerCase().includes(search)
      );
    }

    this.totalItems = filtered.length;
    this.updateDisplayedAccounts(filtered);
  }

  updateDisplayedAccounts(filtered: Account[]): void {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.filteredAccounts = filtered.slice(start, end);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.applyFilters();
  }

  onSearchChange(): void {
    this.pageIndex = 0;
    this.applyFilters();
  }

  onRoleFilterChange(): void {
    this.pageIndex = 0;
    this.applyFilters();
  }

  editAccount(account: Account): void {
    this.router.navigate(['/accounts/edit', account.id]);
  }

  deleteAccount(account: Account): void {
    if (confirm(`Are you sure you want to delete ${account.firstName} ${account.lastName}'s account?`)) {
      this.accountService.deleteAccount(account.id).subscribe({
        next: () => {
          this.loadAccounts();
        },
        error: (error) => {
          console.error('Error deleting account:', error);
          alert('Failed to delete account');
        }
      });
    }
  }

  getRoleColor(role: string): string {
    const colors: { [key: string]: string } = {
      'super_admin': 'warn',
      'admin': 'primary',
      'student': 'accent',
      'bus_driver': 'primary',
      'college_supervisor': 'accent',
      'transportation_supervisor': 'primary'
    };
    return colors[role] || 'primary';
  }
}
