import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrationService } from '../services/registration.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register-step1',
  templateUrl: './register-step1.component.html',
  styleUrls: ['./register-step1.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class RegisterStep1Component {
  firstName: string = '';
  lastName: string = '';
  phoneNumber: string = '';
  address: string = '';
  website: string = '';

  constructor(private router: Router, private registrationService: RegistrationService) {}

  onSubmit() {
    const step1Data = {
      first_name: this.firstName,
      last_name: this.lastName,
      phone_number: this.phoneNumber,
      address: this.address,
      website: this.website
    };

    this.registrationService.registerStep1(step1Data).subscribe(
      response => {
        console.log('Step 1 data submitted successfully:', response);
        this.router.navigate(['/register-step2']);
      },
      error => {
        console.error('Error submitting step 1 data:', error);
      }
    );
  }
}
