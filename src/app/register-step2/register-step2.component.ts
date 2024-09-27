import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrationService } from '../services/registration.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register-step2',
  templateUrl: './register-step2.component.html',
  styleUrls: ['./register-step2.component.css'],
  standalone: true,
  imports: [FormsModule]
})
export class RegisterStep2Component {
  user = {
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  };

  constructor(private router: Router, private registrationService: RegistrationService) {}

  onSubmit() {
    const step2Data = {
      email: this.user.email,
      username: this.user.username,
      password: this.user.password,
    };

    console.log('Submitting Step 2 Data:', step2Data);

    this.registrationService.registerStep2(step2Data).subscribe(
      response => {
        console.log('Step 2 submission successful', response);
        // Corrected the navigation path to match the route in app.routes.ts
        this.router.navigate(['/register-step3']);
      },
      error => {
        console.error('Error submitting step 2 data:', error);
        // Optionally, handle the error (show a message to the user, etc.)
      }
    );
  }
}
