// src/app/services/events.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private baseUrl = 'https://chasin619.pythonanywhere.com/api'; // Direct URL to API

  constructor(private http: HttpClient) {}

  getEvents(params?: any): Observable<any> {
    // Construct query parameters from filters
    let queryParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key]) {
          queryParams = queryParams.append(key, params[key]);
        }
      });
    }

    // Get token from local storage or any other storage you use
    const token = localStorage.getItem('token'); 

    // Set headers for authorization
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(`${this.baseUrl}/events`, { params: queryParams, headers: headers });
  }
}
