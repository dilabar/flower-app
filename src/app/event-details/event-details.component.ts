import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventDetailsService } from '../services/event-details.service';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {
  eventForm: FormGroup;
  eventId: string;
  deliverySetupPrices: any[] = [];
  breakDownPrices: any[] = [];
  transferPrices: any[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private eventDetailsService: EventDetailsService,
    private router: Router
  ) {
    this.eventForm = this.fb.group({
      bride_name: ['', Validators.required],
      groom_name: ['', Validators.required],
      referred_by: [''],
      name: ['', Validators.required],
      wedding_date: ['', Validators.required],  // Changed from wedding_day to wedding_date
      created_day: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      price: [0, Validators.required],
      status: ['', Validators.required],
      delivery_setup_price: [0],
      breakdown_price: [0],
      transfer_fee: [0],
      total_price: [0],
      location: [''],
      guests: [''],
      personal_time: [''],
      personal_location: [''],
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
      labor_time: [0]
    });

    this.eventId = this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.loadEventDetails();
    this.loadPriceOptions();
  }

  loadEventDetails(): void {
    this.eventDetailsService.getEventDetails(this.eventId).subscribe(
      (response: any) => {
        this.eventForm.patchValue(response.event);
      },
      error => console.error('Error loading event details:', error)
    );
  }

  loadPriceOptions(): void {
    this.eventDetailsService.getPriceOptions().subscribe(
      (response: any) => {
        this.deliverySetupPrices = response.delivery_setup_prices;
        this.breakDownPrices = response.break_down_prices;
        this.transferPrices = response.transfer_prices;
      },
      error => console.error('Error loading price options:', error)
    );
  }

  updateEvent(): void {
    if (this.eventForm.valid) {
      this.eventDetailsService.updateEvent(this.eventId, this.eventForm.value).subscribe(
        () => this.router.navigate(['/events']),
        error => console.error('Error updating event:', error)
      );
    }
  }
}
