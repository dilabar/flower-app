import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ColorsService {
  private baseUrl = 'https://chasin619.pythonanywhere.com/api';

  constructor(private http: HttpClient) {}

  // Get available and user-specific colors
  getUserColors(userId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/get_colors/${userId}`);
  }

  // Add a new color
  addColor(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/add_color`, data);
  }

  // Update an existing color
  updateColor(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/update_color`, data);
  }
}
