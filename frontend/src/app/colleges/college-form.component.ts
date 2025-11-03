import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CollegeService, College, CreateCollegeDto, UpdateCollegeDto } from '../core/services/college.service';

@Component({
  selector: 'app-college-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule
  ],
  templateUrl: './college-form.component.html',
  styleUrl: './college-form.component.scss'
})
export class CollegeFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private collegeService = inject(CollegeService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  collegeForm!: FormGroup;
  isEditMode = false;
  collegeId: string | null = null;
  isLoading = false;
  isSubmitting = false;
  showWarning = false;

  ngOnInit(): void {
    this.collegeId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.collegeId;
    
    if (this.isEditMode) {
      this.showWarning = true;
    }
    
    this.initForm();

    if (this.isEditMode && this.collegeId) {
      this.loadCollege();
    }
  }

  initForm(): void {
    this.collegeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      isActive: [true]
    });
  }

  loadCollege(): void {
    if (!this.collegeId) return;

    this.isLoading = true;
    this.collegeService.getCollegeById(this.collegeId).subscribe({
      next: (college) => {
        this.collegeForm.patchValue({
          name: college.name,
          description: college.description || '',
          isActive: college.isActive
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading college:', error);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.collegeForm.invalid) {
      this.collegeForm.markAllAsTouched();
      return;
    }

    // Show warning confirmation on edit
    if (this.isEditMode) {
      const confirmed = confirm(
        `⚠️ WARNING: You are about to update this college.\n\n` +
        `Updating college information may affect:\n` +
        `• Associated students\n` +
        `• Related courses\n` +
        `• Other linked data\n\n` +
        `Are you sure you want to continue?`
      );
      
      if (!confirmed) {
        return;
      }
    }

    this.isSubmitting = true;
    const formValue = this.collegeForm.value;

    if (this.isEditMode && this.collegeId) {
      const updateData: UpdateCollegeDto = {
        name: formValue.name,
        description: formValue.description || undefined,
        isActive: formValue.isActive
      };

      this.collegeService.updateCollege(this.collegeId, updateData).subscribe({
        next: () => {
          this.router.navigate(['/colleges']);
        },
        error: (error) => {
          console.error('Error updating college:', error);
          alert('Failed to update college');
          this.isSubmitting = false;
        }
      });
    } else {
      const createData: CreateCollegeDto = {
        name: formValue.name,
        description: formValue.description || undefined,
        isActive: formValue.isActive
      };

      this.collegeService.createCollege(createData).subscribe({
        next: () => {
          this.router.navigate(['/colleges']);
        },
        error: (error) => {
          console.error('Error creating college:', error);
          alert('Failed to create college');
          this.isSubmitting = false;
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/colleges']);
  }
}
