// src/app/create-event/create-event.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CreateEventService } from '../services/create-event.service';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements OnInit {
  eventForm: FormGroup;
  deliverySetupPrices: any[] = [];
  breakDownPrices: any[] = [];
  transferPrices: any[] = [];
  userId: number | null = null; // Ensure this is number type to match backend expectations

  constructor(
    private fb: FormBuilder,
    private createEventService: CreateEventService,
    private router: Router
  ) {
    this.eventForm = this.fb.group({
      created_day: [{ value: '', disabled: true }, Validators.required],
      wedding_day: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      price: [0, Validators.required],
      status: ['', Validators.required],
      bride_name: [''],
      groom_name: [''],
      referred_by: [''],
      location: [''],
      guests: [''],
      ceremony_start_time: [''],
      ceremony_setup_time: [''],
      ceremony_location: [''],
      cocktails_start_time: [''],
      cocktails_setup_time: [''],
      cocktails_location: [''],
      reception_start_time: [''],
      reception_setup_time: [''],
      reception_location: [''],
      breakdown_time: [''],
      price_arrangements: [0],
      cost_flowers: [0],
      rent_cost_misc: [0],
      labor_time: [0],
      delivery_setup_price: [0],
      breakdown_price: [0],
      transfer_fee: [0],
      total_price: [0],
    });
  }

  ngOnInit(): void {
    // Fetch user_id from localStorage instead of sessionStorage
    const user = localStorage.getItem('user'); 

    if (user) {
      const userData = JSON.parse(user);
      this.userId = userData.id; // Extract user_id from parsed user data
      console.log('User ID retrieved from localStorage:', this.userId); // Debugging line
    }

    if (!this.userId) {
      console.error('User ID not found in local storage. Please log in.');
      this.router.navigate(['/login']); // Redirect to login if user_id is not found
    }

    this.eventForm.get('created_day')?.setValue(new Date().toISOString().split('T')[0]);
    this.loadPriceOptions();
  }

  loadPriceOptions(): void {
    this.createEventService.getPriceOptions().subscribe(
      (response: any) => {
        this.deliverySetupPrices = response.delivery_setup_prices;
        this.breakDownPrices = response.break_down_prices;
        this.transferPrices = response.transfer_prices;
      },
      error => console.error('Error loading price options:', error)
    );
  }

  createEvent(): void {
    if (this.eventForm.valid) {
      const formData = this.eventForm.getRawValue();
      formData.user_id = this.userId; // Ensure user_id is included in the request data

      console.log('Form data being submitted:', formData); // Debugging line

      this.createEventService.createEvent(formData).subscribe(
        (response: any) => {
          if (response.success) {
            this.router.navigate(['/events']);
          } else {
            console.error('Failed to create event:', response.message);
          }
        },
        error => console.error('Error creating event:', error)
      );
    }
  }
}
