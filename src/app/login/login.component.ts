// src/app/login/login.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, CommonModule]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  remember: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.email, this.password, this.remember).subscribe(
      response => {
        console.log('Login successful', response);
        this.router.navigate(['/']); // Redirect to home after successful login
      },
      error => {
        console.error('Login failed', error);
        alert('Login unsuccessful. Please check email and password');
      }
    );
  }
}
