import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component'; // Import SidebarComponent

@Component({
  selector: 'app-labor-cost',
  standalone: true,
  templateUrl: './labor-cost.component.html',
  styleUrls: ['./labor-cost.component.css'],
  imports: [ReactiveFormsModule, CommonModule, SidebarComponent], // Add SidebarComponent to imports
})
export class LaborCostComponent implements OnInit {
  laborCostForm: FormGroup;
  userId: number = 1;  // Replace with actual user ID from your auth service

  constructor(private fb: FormBuilder, private accountService: AccountService) {
    this.laborCostForm = this.fb.group({
      labor_cost_hour: ['', Validators.required],
      labor_cost_minute: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadLaborCost();
  }

  loadLaborCost(): void {
    this.accountService.getLaborCost(this.userId).subscribe((data) => {
      this.laborCostForm.patchValue({
        labor_cost_hour: data.labor_cost_hour,
        labor_cost_minute: data.labor_cost_minute,
      });
    });
  }

  saveLaborCost(): void {
    if (this.laborCostForm.valid) {
      const updatedData = { ...this.laborCostForm.value, user_id: this.userId };
      this.accountService.updateLaborCost(updatedData).subscribe((response) => {
        console.log('Labor cost updated successfully');
      });
    }
  }
}
