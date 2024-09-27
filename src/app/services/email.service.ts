import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private apiUrl = 'https://chasin619.pythonanywhere.com/api';

  constructor(private http: HttpClient, private router: Router) { }

  // Initiate OAuth flow
  authorize() {
    this.http.get<any>(`${this.apiUrl}/authorize`, { withCredentials: true }).subscribe(
      (response) => {
        const authorizationUrl = response.authorization_url;
        window.location.href = authorizationUrl;
      },
      (error) => {
        console.error('Authorization error:', error);
      }
    );
    
  }

  getEmailList(): Observable<any> {
    return this.http.get(`${this.apiUrl}/email_list`, { withCredentials: true });
  }
  
  getEmailContent(emailId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/email_content/${emailId}`, { withCredentials: true });
  }
  
  
  // Download attachment
  downloadAttachment(emailId: string, attachmentId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download_attachment/${emailId}/${attachmentId}`, {
      responseType: 'blob'
    });
  }
}
