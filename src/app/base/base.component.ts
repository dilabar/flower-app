import { Component, Renderer2, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-base',
  standalone: true,
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css'],
  imports: [CommonModule, RouterModule],
})
export class BaseComponent implements OnInit {
  isLoggedIn: boolean = false;
  userInfo: any;

  constructor(
    private renderer: Renderer2,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Load Bootstrap CSS
    this.loadStyles('https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css');

    // Load Bootstrap Icons
    this.loadStyles('https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.10.0/font/bootstrap-icons.min.css'); // Add Bootstrap Icons

    // Load Bootstrap JS and dependencies
    this.loadScript('https://code.jquery.com/jquery-3.5.1.slim.min.js').then(() => {
      this.loadScript('https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js').then(() => {
        this.loadScript('https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js');
      });
    });

    // Subscribe to authentication and user info changes
    this.authService.isAuthenticated$.subscribe((status: boolean) => {
      this.isLoggedIn = status;
    });

    this.authService.userInfo$.subscribe((user: any) => {
      this.userInfo = user;
    });
  }

  logout() {
    this.authService.logout().subscribe(
      () => {
        console.log('Logged out successfully');
        this.router.navigate(['/login']);
      },
      (error) => {
        if (error.status === 401) {
          console.error('Unauthorized, redirecting to login:', error);
          this.router.navigate(['/login']);
        } else {
          console.error('Error during logout:', error);
        }
      }
    );
  }

  loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = this.renderer.createElement('script');
      script.type = 'text/javascript';
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject();
      this.renderer.appendChild(document.body, script);
    });
  }

  loadStyles(href: string) {
    const link = this.renderer.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    this.renderer.appendChild(document.head, link);
  }
}
