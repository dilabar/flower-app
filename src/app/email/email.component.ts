import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EmailService } from '../services/email.service';

@Component({
  selector: 'app-email',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit {

  emails: any[] = [];
  errorMessage: string = '';

  constructor(private emailService: EmailService) { }

  ngOnInit(): void {
    this.fetchEmails();
  }

  fetchEmails(): void {
    this.emailService.getEmailList().subscribe(
      (data) => {
        console.log('Emails data:', data);  // Log the full response
        if (data.emails && data.emails.length > 0) {
          this.emails = data.emails;
        } else {
          this.errorMessage = 'No emails found.';
        }
      },
      (error) => {
        if (error.status === 401) {
          this.emailService.authorize(); // Redirect to Google OAuth if not authorized
        } else {
          this.errorMessage = 'Error fetching email list.';
          console.error('Error fetching email list:', error);
        }
      }
    );
  }
}
