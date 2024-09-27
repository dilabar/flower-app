// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://chasin619.pythonanywhere.com/api'; // Your backend API URL
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();
  private userInfoSubject = new BehaviorSubject<any>(null);
  public userInfo$: Observable<any> = this.userInfoSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.checkInitialLoginStatus();
  }

  login(email: string, password: string, remember: boolean): Observable<any> {
    const loginData = { email, password, remember };
    return this.http.post(`${this.apiUrl}/login`, loginData).pipe(
      tap((response: any) => {
        this.isAuthenticatedSubject.next(true);
        this.userInfoSubject.next(response.user);
        localStorage.setItem('token', response.token); // Use localStorage instead of sessionStorage
        localStorage.setItem('user', JSON.stringify(response.user)); // Use localStorage instead of sessionStorage
      })
    );
  }

  logout(): Observable<any> {
    const token = localStorage.getItem('token'); // Use localStorage
  
    // Ensure token is present and formatted correctly
    if (!token) {
      console.error('Token not found. User is not logged in.');
      this.router.navigate(['/login']);
      return of(null);  // Return an observable that emits null
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.post(`${this.apiUrl}/logout`, {}, { headers }).pipe(
      tap(() => {
        this.isAuthenticatedSubject.next(false);
        this.userInfoSubject.next(null);
        localStorage.removeItem('token'); // Use localStorage
        localStorage.removeItem('user'); // Use localStorage
        this.router.navigate(['/login']); // Navigate to login after logout
      }),
      catchError((error) => {
        if (error.status === 401) {
          console.error('Unauthorized, redirecting to login:', error);
          this.router.navigate(['/login']);
        } else {
          console.error('Error during logout:', error);
        }
        return of(null);  // Ensure the Observable completes
      })
    );
  }
  

  getUserInfo(): any {
    return JSON.parse(localStorage.getItem('user') || '{}'); // Use localStorage
  }

  private checkInitialLoginStatus() {
    const token = localStorage.getItem('token'); // Use localStorage
    const user = localStorage.getItem('user'); // Use localStorage

    if (token && user) {
      this.isAuthenticatedSubject.next(true);
      this.userInfoSubject.next(JSON.parse(user));
    } else {
      this.isAuthenticatedSubject.next(false);
    }
  }
}
