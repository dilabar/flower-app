import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AccountService } from '../../services/account.service'; // Adjust the path if needed
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-delivery-set-up-price',
  standalone: true,
  templateUrl: './delivery-set-up-price.component.html',
  styleUrls: ['./delivery-set-up-price.component.css'],
  imports: [CommonModule, RouterModule, ReactiveFormsModule, SidebarComponent]  // Import ReactiveFormsModule
})
export class DeliverySetUpPriceComponent implements OnInit {
  deliveryForm: FormGroup;
  deliveryPrices: any[] = [];

  constructor(private fb: FormBuilder, private accountService: AccountService) {
    this.deliveryForm = this.fb.group({
      delivery_name: ['', Validators.required],
      delivery_price: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadDeliveryPrices();
  }
  
  loadDeliveryPrices(): void {
    const userId = this.getUserId(); // Fetch userId
    this.accountService.getDeliveryPrices(userId).subscribe((data) => {
      this.deliveryPrices = data;
    });
  }
  

  createDeliveryPrice(): void {
    const userId = this.getUserId(); // Fetch the user ID (this could be from a service or localStorage)
    
    if (this.deliveryForm.valid) {
      const formData = { ...this.deliveryForm.value, user_id: userId }; // Include user_id in the form data
      this.accountService.createDeliveryPrice(formData).subscribe(() => {
        this.loadDeliveryPrices(); // Reload the delivery prices after creation
        this.deliveryForm.reset();
      });
    }
  }
  
  // Method to get user ID (assuming it's stored in localStorage or in the auth service)
  getUserId(): number {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.id;
  }
  

  setDefaultPrice(priceId: number): void {
    this.accountService.setDefaultDeliveryPrice(priceId).subscribe(() => {
      this.loadDeliveryPrices(); // Reload the delivery prices after setting default
    });
  }

  deleteDeliveryPrice(priceId: number): void {
    this.accountService.deleteDeliveryPrice(priceId).subscribe(() => {
      this.loadDeliveryPrices(); // Reload the delivery prices after deletion
    });
  }
}
