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
import { AuthService } from '../core/services/auth.service';

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
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  accountForm!: FormGroup;
  isEditMode = false;
  accountId: string | null = null;
  isLoading = false;
  isSubmitting = false;
  currentUser = this.authService.getUser();

  roles = [
    { value: 'admin', label: 'Admin' },
    { value: 'student', label: 'Student' },
    { value: 'bus_driver', label: 'Bus Driver' },
    { value: 'college_supervisor', label: 'College Supervisor' },
    { value: 'transportation_supervisor', label: 'Transportation Supervisor' }
  ];

  get availableRoles() {
    // Admin cannot create admin or super_admin accounts
    if (this.isAdmin() && !this.isSuperAdmin()) {
      return this.roles.filter(r => r.value !== 'admin');
    }
    return this.roles;
  }

  isSuperAdmin(): boolean {
    return this.currentUser?.role === 'super_admin';
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  canChangePassword(): boolean {
    // Only super admin can change passwords in edit mode
    return this.isEditMode && this.isSuperAdmin();
  }

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
      if (role) {
        this.updateFormValidators(role);
      }
    });

    // For password change fields, update validation when password is entered
    ['password', 'studentPassword', 'driverPassword'].forEach(fieldName => {
      this.accountForm.get(fieldName)?.valueChanges.subscribe(value => {
        if (this.isEditMode && this.canChangePassword() && value) {
          const role = this.accountForm.get('role')?.value;
          this.updateFormValidators(role);
        }
      });
    });
  }

  updateFormValidators(role: string): void {
    if (!role || !this.accountForm) {
      return;
    }

    // Reset values for fields that are not relevant to the new role
    // This prevents validation errors from leftover values
    const fieldsToReset: string[] = [];
    
    if (role !== 'admin' && role !== 'college_supervisor' && role !== 'transportation_supervisor') {
      fieldsToReset.push('firstName', 'lastName', 'username', 'password', 'confirmPassword');
    }
    if (role !== 'student') {
      fieldsToReset.push('studentFirstName', 'studentLastName', 'universityId', 'studentPassword', 'studentConfirmPassword', 'collegeId');
    }
    if (role !== 'bus_driver') {
      fieldsToReset.push('driverFirstName', 'driverLastName', 'driverUsername', 'driverPassword', 'driverConfirmPassword', 'driverLicenseNumber');
    }

    // Reset non-relevant fields
    fieldsToReset.forEach(field => {
      const control = this.accountForm.get(field);
      if (control && !this.isEditMode) {
        control.setValue('');
      }
      control?.clearValidators();
    });

    // Add role-specific validators
    try {
      if (role === 'admin') {
        this.accountForm.get('firstName')?.setValidators([Validators.required]);
        this.accountForm.get('lastName')?.setValidators([Validators.required]);
        this.accountForm.get('username')?.setValidators([Validators.required]);
        if (!this.isEditMode) {
          this.accountForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
          this.accountForm.get('confirmPassword')?.setValidators([Validators.required]);
        } else if (this.canChangePassword()) {
          // Super admin can optionally change password in edit mode
          const passwordControl = this.accountForm.get('password');
          const confirmPasswordControl = this.accountForm.get('confirmPassword');
          // If password is provided, both fields must be filled and match
          if (passwordControl?.value) {
            passwordControl.setValidators([Validators.minLength(6)]);
            confirmPasswordControl?.setValidators([Validators.required]);
          } else {
            passwordControl?.clearValidators();
            confirmPasswordControl?.clearValidators();
          }
        }
      } else if (role === 'student') {
        this.accountForm.get('studentFirstName')?.setValidators([Validators.required]);
        this.accountForm.get('studentLastName')?.setValidators([Validators.required]);
        this.accountForm.get('universityId')?.setValidators([Validators.required]);
        // collegeId is optional for students
        if (!this.isEditMode) {
          this.accountForm.get('studentPassword')?.setValidators([Validators.required, Validators.minLength(6)]);
          this.accountForm.get('studentConfirmPassword')?.setValidators([Validators.required]);
        } else if (this.canChangePassword()) {
          // Super admin can optionally change student password in edit mode
          const passwordControl = this.accountForm.get('studentPassword');
          const confirmPasswordControl = this.accountForm.get('studentConfirmPassword');
          if (passwordControl?.value) {
            passwordControl.setValidators([Validators.minLength(6)]);
            confirmPasswordControl?.setValidators([Validators.required]);
          } else {
            passwordControl?.clearValidators();
            confirmPasswordControl?.clearValidators();
          }
        }
      } else if (role === 'bus_driver') {
        this.accountForm.get('driverFirstName')?.setValidators([Validators.required]);
        this.accountForm.get('driverLastName')?.setValidators([Validators.required]);
        this.accountForm.get('driverUsername')?.setValidators([Validators.required]);
        this.accountForm.get('driverLicenseNumber')?.setValidators([Validators.required]);
        if (!this.isEditMode) {
          this.accountForm.get('driverPassword')?.setValidators([Validators.required, Validators.minLength(6)]);
          this.accountForm.get('driverConfirmPassword')?.setValidators([Validators.required]);
        } else if (this.canChangePassword()) {
          // Super admin can optionally change driver password in edit mode
          const passwordControl = this.accountForm.get('driverPassword');
          const confirmPasswordControl = this.accountForm.get('driverConfirmPassword');
          if (passwordControl?.value) {
            passwordControl.setValidators([Validators.minLength(6)]);
            confirmPasswordControl?.setValidators([Validators.required]);
          } else {
            passwordControl?.clearValidators();
            confirmPasswordControl?.clearValidators();
          }
        }
      }
      // For other roles (college_supervisor, transportation_supervisor), use admin-like fields
      else if (role === 'college_supervisor' || role === 'transportation_supervisor') {
        this.accountForm.get('firstName')?.setValidators([Validators.required]);
        this.accountForm.get('lastName')?.setValidators([Validators.required]);
        this.accountForm.get('username')?.setValidators([Validators.required]);
        if (!this.isEditMode) {
          this.accountForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
          this.accountForm.get('confirmPassword')?.setValidators([Validators.required]);
        } else if (this.canChangePassword()) {
          // Super admin can optionally change password in edit mode
          const passwordControl = this.accountForm.get('password');
          const confirmPasswordControl = this.accountForm.get('confirmPassword');
          if (passwordControl?.value) {
            passwordControl.setValidators([Validators.minLength(6)]);
            confirmPasswordControl?.setValidators([Validators.required]);
          } else {
            passwordControl?.clearValidators();
            confirmPasswordControl?.clearValidators();
          }
        }
      }
    } catch (error) {
      console.error('Error setting validators:', error);
    }

    // Update validation for all controls except role (keep role validator)
    Object.keys(this.accountForm.controls).forEach(key => {
      if (key !== 'role') {
        this.accountForm.get(key)?.updateValueAndValidity({ emitEvent: false });
      }
    });
  }

  loadAccount(): void {
    if (!this.accountId) return;

    this.isLoading = true;
    this.accountService.getAccountById(this.accountId).subscribe({
      next: (account) => {
        // Map fields based on role
        if (account.role === 'student') {
          this.accountForm.patchValue({
            role: account.role,
            studentFirstName: account.firstName,
            studentLastName: account.lastName,
            universityId: account.universityId,
            email: account.email,
            phoneNumber: account.phoneNumber
          });
        } else if (account.role === 'bus_driver') {
          this.accountForm.patchValue({
            role: account.role,
            driverFirstName: account.firstName,
            driverLastName: account.lastName,
            driverUsername: account.username,
            driverLicenseNumber: account.driverLicenseNumber,
            email: account.email,
            phoneNumber: account.phoneNumber
          });
        } else {
          // Admin, college_supervisor, transportation_supervisor
          this.accountForm.patchValue({
            role: account.role,
            firstName: account.firstName,
            lastName: account.lastName,
            username: account.username,
            email: account.email,
            phoneNumber: account.phoneNumber
          });
        }
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
    if (role === 'admin' || role === 'college_supervisor' || role === 'transportation_supervisor') {
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

    // Prevent admin from creating admin accounts
    if (!this.isEditMode && this.isAdmin() && !this.isSuperAdmin()) {
      const selectedRole = this.accountForm.get('role')?.value;
      if (selectedRole === 'admin' || selectedRole === 'super_admin') {
        alert('You do not have permission to create admin accounts');
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

      // Super admin can change password for any role
      if (this.canChangePassword()) {
        // For admin, college_supervisor, transportation_supervisor
        if ((formValue.role === 'admin' || formValue.role === 'college_supervisor' || formValue.role === 'transportation_supervisor') && formValue.password) {
          updateData.password = formValue.password;
          updateData.confirmPassword = formValue.confirmPassword;
        }
        // For student
        else if (formValue.role === 'student' && formValue.studentPassword) {
          updateData.password = formValue.studentPassword;
          updateData.confirmPassword = formValue.studentConfirmPassword;
        }
        // For bus_driver
        else if (formValue.role === 'bus_driver' && formValue.driverPassword) {
          updateData.password = formValue.driverPassword;
          updateData.confirmPassword = formValue.driverConfirmPassword;
        }
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

      if (formValue.role === 'admin' || formValue.role === 'college_supervisor' || formValue.role === 'transportation_supervisor') {
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
        // collegeId is optional - only include if provided
        if (formValue.collegeId) {
          createData.collegeId = formValue.collegeId;
        }
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
