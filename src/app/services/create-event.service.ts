// src/app/services/create-event.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CreateEventService {
  private baseUrl = 'https://chasin619.pythonanywhere.com/api'; // Adjust your base URL as necessary

  constructor(private http: HttpClient) {}

  createEvent(eventData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create_event`, eventData); // Use eventData as is
  }

  getPriceOptions(): Observable<any> {
    return this.http.get(`${this.baseUrl}/price-options`); // Endpoint to fetch price options
  }
}
