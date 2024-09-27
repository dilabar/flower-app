import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-break-down-price',
  standalone: true,
  templateUrl: './break-down-price.component.html',
  styleUrls: ['./break-down-price.component.css'],
  imports: [ReactiveFormsModule, CommonModule, SidebarComponent], // Import necessary modules including SidebarComponent
})
export class BreakDownPriceComponent implements OnInit {
  breakDownForm: FormGroup;
  breakDownPrices: any[] = [];
  userId: number = 1; // Replace with actual user ID from your auth service

  constructor(private fb: FormBuilder, private accountService: AccountService) {
    this.breakDownForm = this.fb.group({
      break_down_name: ['', Validators.required],
      break_down_price: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadBreakDownPrices();
  }

  // Load all the breakdown prices for the user
  loadBreakDownPrices(): void {
    this.accountService.getBreakDownPrices(this.userId).subscribe((prices) => {
      this.breakDownPrices = prices;
    });
  }

  // Submit the form to create a new breakdown price
  createBreakDownPrice(): void {
    if (this.breakDownForm.valid) {
      const formData = { ...this.breakDownForm.value, user_id: this.userId };
      this.accountService.createBreakDownPrice(formData).subscribe(() => {
        this.loadBreakDownPrices(); // Reload the prices after successful creation
        this.breakDownForm.reset();
      });
    }
  }

  // Set a price as default
  setDefaultPrice(priceId: number): void {
    this.accountService.setDefaultBreakDownPrice(priceId, this.userId).subscribe(() => {
      this.loadBreakDownPrices(); // Reload the prices after setting default
    });
  }

  // Delete a breakdown price
  deletePrice(priceId: number): void {
    this.accountService.deleteBreakDownPrice(priceId).subscribe(() => {
      this.loadBreakDownPrices(); // Reload the prices after deletion
    });
  }
}
