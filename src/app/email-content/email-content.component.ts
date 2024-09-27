import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common'; // Required for ngForOf
import { RouterModule } from '@angular/router'; // Required for routerLink
import { EmailService } from '../services/email.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'; // Import DomSanitizer

@Component({
  selector: 'app-email-content',
  standalone: true,
  imports: [CommonModule, RouterModule], // Add both CommonModule and RouterModule
  templateUrl: './email-content.component.html',
  styleUrls: ['./email-content.component.css']
})
export class EmailContentComponent implements OnInit {
  headers: any[] = [];
  body: SafeHtml = '';  // Update body type to SafeHtml
  attachments: any[] = [];

  constructor(
    private emailService: EmailService, 
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer // Inject DomSanitizer
  ) {}

  ngOnInit(): void {
    const emailId = this.route.snapshot.paramMap.get('emailId');
    if (emailId) {
      this.emailService.getEmailContent(emailId).subscribe(
        (data) => {
          this.headers = data.headers || [];
          this.body = this.sanitizeHtml(data.body || 'No content available');  // Sanitize HTML
          this.attachments = data.attachments || [];
        },
        (error) => {
          console.error('Error fetching email content:', error);
        }
      );
    }
  }

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html); // Use bypassSecurityTrustHtml
  }

  printPDF(): void {
    window.print();
  }
}
