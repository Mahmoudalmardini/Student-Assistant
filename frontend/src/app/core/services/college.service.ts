import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface College {
  id: string;
  name: string;
  description?: string;
  location?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCollegeDto {
  name: string;
  description?: string;
  location?: string;
  isActive?: boolean;
}

export interface UpdateCollegeDto {
  name?: string;
  description?: string;
  location?: string;
  isActive?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CollegeService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/colleges`;

  getAllColleges(): Observable<College[]> {
    return this.http.get<College[]>(this.apiUrl);
  }

  getCollegeById(id: string): Observable<College> {
    return this.http.get<College>(`${this.apiUrl}/${id}`);
  }

  createCollege(college: CreateCollegeDto): Observable<College> {
    return this.http.post<College>(this.apiUrl, college);
  }

  updateCollege(id: string, college: UpdateCollegeDto): Observable<College> {
    return this.http.patch<College>(`${this.apiUrl}/${id}`, college);
  }

  deleteCollege(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
