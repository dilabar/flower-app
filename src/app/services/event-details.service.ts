// src/app/services/event-details.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventDetailsService {
  private baseUrl = 'https://chasin619.pythonanywhere.com/api'; // Adjust your base URL as necessary

  constructor(private http: HttpClient) {}

  getEventDetails(eventId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/event-details/${eventId}`);
  }

  updateEvent(eventId: string, eventData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/update-event/${eventId}`, eventData);
  }

  getPriceOptions(): Observable<any> {
    return this.http.get(`${this.baseUrl}/price-options`); // Ensure the backend provides this endpoint
  }
}
