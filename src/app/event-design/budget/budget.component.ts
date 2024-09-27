import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BudgetService } from '../../services/budget.service'; // Import the budget service
import { Observable } from 'rxjs';

@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css']
})
export class BudgetComponent implements OnInit {
  budget$: Observable<number>; // Use Observable to get live budget updates
  eventId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private budgetService: BudgetService
  ) {
    this.budget$ = this.budgetService.budget$; // Subscribe to the budget from the service
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.eventId = Number(params.get('eventId'));
      if (this.eventId) {
        this.loadBudget();
      }
    });
  }

  // Fetch the budget for the current event
  loadBudget(): void {
    this.budgetService.getBudget(this.eventId!).subscribe(
      (budget) => console.log(`Budget loaded: $${budget}`),
      (error) => console.error('Error loading budget:', error)
    );
  }
}
