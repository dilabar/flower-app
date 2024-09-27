import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrationService } from '../services/registration.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register-step3',
  templateUrl: './register-step3.component.html',
  styleUrls: ['./register-step3.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class RegisterStep3Component {
  plans = [
    {
      name: 'Monthly',
      price: '$99/month',
      details: 'FULL ACCESS TO ALL TOOLS!',
      trial: '14-Day Free Trial',
      value: 'monthly'
    },
    {
      name: 'Quarterly',
      price: '$200/quarter',
      details: 'FULL ACCESS TO ALL TOOLS!',
      trial: '14-Day Free Trial',
      value: 'quarterly'
    },
    {
      name: 'Yearly',
      price: '$999/year',
      details: '2 MONTHS FOR FREE!',
      trial: 'FULL ACCESS TO ALL TOOLS!',
      value: 'yearly'
    }
  ];

  constructor(private router: Router, private registrationService: RegistrationService) {}

  onSelectPlan(plan: string) {
    const selectedPlan = { plan };
    this.registrationService.registerStep3(selectedPlan).subscribe(
      response => {
        console.log('Step 3 data submitted successfully:', response);
        this.router.navigate(['/registration-complete']);
      },
      error => {
        console.error('Error submitting step 3 data:', error);
      }
    );
  }
}
