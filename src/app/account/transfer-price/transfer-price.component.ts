import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-transfer-price',
  standalone: true,
  templateUrl: './transfer-price.component.html',
  styleUrls: ['./transfer-price.component.css'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class TransferPriceComponent implements OnInit {
  transferForm: FormGroup;
  transferPrices: any[] = []; // Store list of transfer prices

  constructor(private fb: FormBuilder, private accountService: AccountService) {
    this.transferForm = this.fb.group({
      transfer_name: ['', Validators.required],
      transfer_price: ['', [Validators.required, Validators.pattern("^[0-9]+(\.[0-9]{1,2})?$")]] // Accepts decimals
    });
  }

  ngOnInit(): void {
    this.loadTransferPrices();
  }

  loadTransferPrices(): void {
    const userId = 1; // Replace with actual user ID logic
    this.accountService.getTransferPrices(userId).subscribe((data) => {
      this.transferPrices = data;
    });
  }

  createTransferPrice(): void {
    if (this.transferForm.valid) {
      const newPrice = {
        ...this.transferForm.value,
        user_id: 1 // Replace with actual user ID logic
      };
      this.accountService.createTransferPrice(newPrice).subscribe(() => {
        this.loadTransferPrices(); // Reload prices after successful creation
        this.transferForm.reset();
      });
    }
  }

  setDefaultTransferPrice(priceId: number): void {
    this.accountService.setDefaultTransferPrice(priceId, 1).subscribe(() => {
      this.loadTransferPrices(); // Reload prices after setting default
    });
  }

  deleteTransferPrice(priceId: number): void {
    this.accountService.deleteTransferPrice(priceId).subscribe(() => {
      this.loadTransferPrices(); // Reload prices after deletion
    });
  }
}
