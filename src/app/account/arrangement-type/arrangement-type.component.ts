import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule for template-driven forms
import { CommonModule } from '@angular/common'; // Import CommonModule
import { AccountService } from '../../services/account.service';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-arrangement-type',
  standalone: true,
  imports: [RouterModule,FormsModule, CommonModule], // Add FormsModule and CommonModule to the imports array
  templateUrl: './arrangement-type.component.html',
  styleUrls: ['./arrangement-type.component.css'],
})
export class ArrangementTypeComponent {
  arrangementTypeData = { type_name: '', user_id: 0 }; // Model for form data
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private accountService: AccountService, private authService: AuthService) {
    // Fetch the user ID from the AuthService
    const user = this.authService.getUserInfo();
    this.arrangementTypeData.user_id = user.id;
  }

  onSubmit(): void {
    this.accountService.createArrangementType(this.arrangementTypeData).subscribe(
      (response) => {
        if (response.success) {
          this.successMessage = 'Arrangement Type created successfully!';
          this.errorMessage = null;
          this.arrangementTypeData.type_name = ''; // Clear the form
        } else {
          this.successMessage = null;
          this.errorMessage = response.message || 'An error occurred';
        }
      },
      (error) => {
        this.successMessage = null;
        this.errorMessage = 'An error occurred while creating the arrangement type';
      }
    );
  }
}
