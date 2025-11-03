import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AccountService, Account, CreateAccountDto, UpdateAccountDto } from '../core/services/account.service';

@Component({
  selector: 'app-account-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './account-form.component.html',
  styleUrl: './account-form.component.scss'
})
export class AccountFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  accountForm!: FormGroup;
  isEditMode = false;
  accountId: string | null = null;
  isLoading = false;
  isSubmitting = false;

  roles = [
    { value: 'admin', label: 'Admin' },
    { value: 'student', label: 'Student' },
    { value: 'bus_driver', label: 'Bus Driver' },
    { value: 'college_supervisor', label: 'College Supervisor' },
    { value: 'transportation_supervisor', label: 'Transportation Supervisor' }
  ];

  ngOnInit(): void {
    this.accountId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.accountId;
    this.initForm();

    if (this.isEditMode && this.accountId) {
      this.loadAccount();
    }
  }

  initForm(): void {
    this.accountForm = this.fb.group({
      role: ['', Validators.required],
      // Admin fields
      firstName: [''],
      lastName: [''],
      username: [''],
      password: [''],
      confirmPassword: [''],
      // Student fields
      studentFirstName: [''],
      studentLastName: [''],
      universityId: [''],
      studentPassword: [''],
      studentConfirmPassword: [''],
      collegeId: [''],
      // Driver fields
      driverFirstName: [''],
      driverLastName: [''],
      driverUsername: [''],
      driverPassword: [''],
      driverConfirmPassword: [''],
      driverLicenseNumber: [''],
      // Common fields
      email: [''],
      phoneNumber: ['']
    });

    // Add validators based on role
    this.accountForm.get('role')?.valueChanges.subscribe(role => {
      this.updateFormValidators(role);
    });
  }

  updateFormValidators(role: string): void {
    // Remove all validators first
    Object.keys(this.accountForm.controls).forEach(key => {
      this.accountForm.get(key)?.clearValidators();
      this.accountForm.get(key)?.updateValueAndValidity();
    });

    // Add role-specific validators
    if (role === 'admin') {
      this.accountForm.get('firstName')?.setValidators([Validators.required]);
      this.accountForm.get('lastName')?.setValidators([Validators.required]);
      this.accountForm.get('username')?.setValidators([Validators.required]);
      if (!this.isEditMode) {
        this.accountForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
        this.accountForm.get('confirmPassword')?.setValidators([Validators.required]);
      }
    } else if (role === 'student') {
      this.accountForm.get('studentFirstName')?.setValidators([Validators.required]);
      this.accountForm.get('studentLastName')?.setValidators([Validators.required]);
      this.accountForm.get('universityId')?.setValidators([Validators.required]);
      if (!this.isEditMode) {
        this.accountForm.get('studentPassword')?.setValidators([Validators.required, Validators.minLength(6)]);
        this.accountForm.get('studentConfirmPassword')?.setValidators([Validators.required]);
      }
      this.accountForm.get('collegeId')?.setValidators([Validators.required]);
    } else if (role === 'bus_driver') {
      this.accountForm.get('driverFirstName')?.setValidators([Validators.required]);
      this.accountForm.get('driverLastName')?.setValidators([Validators.required]);
      this.accountForm.get('driverUsername')?.setValidators([Validators.required]);
      this.accountForm.get('driverLicenseNumber')?.setValidators([Validators.required]);
      if (!this.isEditMode) {
        this.accountForm.get('driverPassword')?.setValidators([Validators.required, Validators.minLength(6)]);
        this.accountForm.get('driverConfirmPassword')?.setValidators([Validators.required]);
      }
    }

    // Update validation
    Object.keys(this.accountForm.controls).forEach(key => {
      this.accountForm.get(key)?.updateValueAndValidity();
    });
  }

  loadAccount(): void {
    if (!this.accountId) return;

    this.isLoading = true;
    this.accountService.getAccountById(this.accountId).subscribe({
      next: (account) => {
        this.accountForm.patchValue({
          role: account.role,
          firstName: account.firstName,
          lastName: account.lastName,
          username: account.username,
          universityId: account.universityId,
          driverLicenseNumber: account.driverLicenseNumber,
          email: account.email,
          phoneNumber: account.phoneNumber
        });
        this.updateFormValidators(account.role);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading account:', error);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.accountForm.invalid) {
      this.accountForm.markAllAsTouched();
      return;
    }

    // Validate password confirmation
    const role = this.accountForm.get('role')?.value;
    if (role === 'admin') {
      const password = this.accountForm.get('password')?.value;
      const confirmPassword = this.accountForm.get('confirmPassword')?.value;
      if (password && password !== confirmPassword) {
        alert('Passwords do not match');
        return;
      }
    } else if (role === 'student') {
      const password = this.accountForm.get('studentPassword')?.value;
      const confirmPassword = this.accountForm.get('studentConfirmPassword')?.value;
      if (password && password !== confirmPassword) {
        alert('Passwords do not match');
        return;
      }
    } else if (role === 'bus_driver') {
      const password = this.accountForm.get('driverPassword')?.value;
      const confirmPassword = this.accountForm.get('driverConfirmPassword')?.value;
      if (password && password !== confirmPassword) {
        alert('Passwords do not match');
        return;
      }
    }

    this.isSubmitting = true;
    const formValue = this.accountForm.value;

    if (this.isEditMode && this.accountId) {
      const updateData: UpdateAccountDto = {
        firstName: formValue.firstName || formValue.studentFirstName || formValue.driverFirstName,
        lastName: formValue.lastName || formValue.studentLastName || formValue.driverLastName,
        username: formValue.username || formValue.driverUsername,
        email: formValue.email,
        phoneNumber: formValue.phoneNumber,
        universityId: formValue.universityId,
        driverLicenseNumber: formValue.driverLicenseNumber
      };

      if (formValue.password) {
        updateData.password = formValue.password;
        updateData.confirmPassword = formValue.confirmPassword;
      }

      this.accountService.updateAccount(this.accountId, updateData).subscribe({
        next: () => {
          this.router.navigate(['/accounts']);
        },
        error: (error) => {
          console.error('Error updating account:', error);
          alert('Failed to update account');
          this.isSubmitting = false;
        }
      });
    } else {
      const createData: CreateAccountDto = {
        role: formValue.role
      };

      if (formValue.role === 'admin') {
        createData.firstName = formValue.firstName;
        createData.lastName = formValue.lastName;
        createData.username = formValue.username;
        createData.password = formValue.password;
        createData.confirmPassword = formValue.confirmPassword;
      } else if (formValue.role === 'student') {
        createData.studentFirstName = formValue.studentFirstName;
        createData.studentLastName = formValue.studentLastName;
        createData.universityId = formValue.universityId;
        createData.studentPassword = formValue.studentPassword;
        createData.studentConfirmPassword = formValue.studentConfirmPassword;
        createData.collegeId = formValue.collegeId;
      } else if (formValue.role === 'bus_driver') {
        createData.driverFirstName = formValue.driverFirstName;
        createData.driverLastName = formValue.driverLastName;
        createData.driverUsername = formValue.driverUsername;
        createData.driverPassword = formValue.driverPassword;
        createData.driverConfirmPassword = formValue.driverConfirmPassword;
        createData.driverLicenseNumber = formValue.driverLicenseNumber;
      }

      this.accountService.createAccount(createData).subscribe({
        next: () => {
          this.router.navigate(['/accounts']);
        },
        error: (error) => {
          console.error('Error creating account:', error);
          alert('Failed to create account');
          this.isSubmitting = false;
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/accounts']);
  }
}
