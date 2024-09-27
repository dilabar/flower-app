import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'https://chasin619.pythonanywhere.com/api';

  constructor(private http: HttpClient) {}

  // Fetch user profile using the Authorization token
  getProfile(userId: number): Observable<any> {
    const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/get_profile`, { headers });
  }

  // Update user profile
  updateProfile(profileData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/update_profile`, profileData);
  }

  // Upload profile picture
  uploadProfilePicture(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/upload_profile_picture`, formData);
  }
}
