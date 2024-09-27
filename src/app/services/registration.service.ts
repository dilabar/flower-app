import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private apiUrl = 'https://chasin619.pythonanywhere.com/api/register';

  constructor(private http: HttpClient) {}

  registerStep1(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/step1`, data, { withCredentials: true });
  }

  registerStep2(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/step2`, data, { withCredentials: true });
  }
  
  registerStep3(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/step3`, data, { withCredentials: true });
  }
}
