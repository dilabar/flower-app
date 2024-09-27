import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private eventsUrl = 'https://chasin619.pythonanywhere.com/api/get-events';  // Update this URL to match your API endpoint

  constructor(private http: HttpClient) { }

  getEvents(): Observable<any[]> {
    return this.http.get<any[]>(this.eventsUrl);
  }
}
