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
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { CollegeService, College } from '../core/services/college.service';

@Component({
  selector: 'app-college-list',
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
    MatChipsModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  templateUrl: './college-list.component.html',
  styleUrl: './college-list.component.scss'
})
export class CollegeListComponent implements OnInit {
  private collegeService = inject(CollegeService);
  private router = inject(Router);

  colleges: College[] = [];
  displayedColumns: string[] = ['name', 'description', 'status', 'actions'];
  filteredColleges: College[] = [];
  isLoading = false;
  searchTerm = '';

  // Pagination
  pageSize = 10;
  pageIndex = 0;
  totalItems = 0;

  ngOnInit(): void {
    this.loadColleges();
  }

  loadColleges(): void {
    this.isLoading = true;
    this.collegeService.getAllColleges().subscribe({
      next: (colleges) => {
        this.colleges = colleges;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading colleges:', error);
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.colleges];

    // Search filter
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(college =>
        college.name?.toLowerCase().includes(search) ||
        college.description?.toLowerCase().includes(search)
      );
    }

    this.totalItems = filtered.length;
    this.updateDisplayedColleges(filtered);
  }

  updateDisplayedColleges(filtered: College[]): void {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.filteredColleges = filtered.slice(start, end);
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

  editCollege(college: College): void {
    const confirmed = confirm(
      `⚠️ WARNING: You are about to edit "${college.name}".\n\n` +
      `Editing this college may affect associated students and courses. ` +
      `Are you sure you want to continue?`
    );
    
    if (confirmed) {
      this.router.navigate(['/colleges/edit', college.id]);
    }
  }

  deleteCollege(college: College): void {
    const confirmed = confirm(
      `⚠️ WARNING: You are about to DELETE "${college.name}".\n\n` +
      `This action cannot be undone and may affect:\n` +
      `• Associated students\n` +
      `• Related courses\n` +
      `• Other linked data\n\n` +
      `Are you absolutely sure you want to delete this college?`
    );
    
    if (confirmed) {
      this.collegeService.deleteCollege(college.id).subscribe({
        next: () => {
          this.loadColleges();
        },
        error: (error) => {
          console.error('Error deleting college:', error);
          alert('Failed to delete college. It may have associated data.');
        }
      });
    }
  }
}
