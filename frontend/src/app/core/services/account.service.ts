import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Account {
  id: string;
  username?: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  role: string;
  universityId?: string;
  driverLicenseNumber?: string;
  collegeId?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAccountDto {
  role: string;
  // Admin fields
  firstName?: string;
  lastName?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
  // Student fields
  studentFirstName?: string;
  studentLastName?: string;
  universityId?: string;
  studentPassword?: string;
  studentConfirmPassword?: string;
  collegeId?: string;
  // Driver fields
  driverFirstName?: string;
  driverLastName?: string;
  driverUsername?: string;
  driverPassword?: string;
  driverConfirmPassword?: string;
  driverLicenseNumber?: string;
}

export interface UpdateAccountDto {
  firstName?: string;
  lastName?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
  email?: string;
  phoneNumber?: string;
  universityId?: string;
  driverLicenseNumber?: string;
  isActive?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/accounts`;

  getAllAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(this.apiUrl);
  }

  getAccountById(id: string): Observable<Account> {
    return this.http.get<Account>(`${this.apiUrl}/${id}`);
  }

  getAccountsByRole(role: string): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.apiUrl}/role/${role}`);
  }

  createAccount(account: CreateAccountDto): Observable<Account> {
    return this.http.post<Account>(this.apiUrl, account);
  }

  updateAccount(id: string, account: UpdateAccountDto): Observable<Account> {
    return this.http.patch<Account>(`${this.apiUrl}/${id}`, account);
  }

  deleteAccount(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
