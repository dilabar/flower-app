import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private budgetUrl = 'https://chasin619.pythonanywhere.com/api/event_budget'; // API endpoint for budget
  private budgetSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public budget$: Observable<number> = this.budgetSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Fetch the initial budget for the event
  getBudget(eventId: number): Observable<number> {
    return this.http.get<any>(`${this.budgetUrl}/${eventId}`).pipe(
      map(response => response.budget),
      tap(budget => this.budgetSubject.next(budget)) // Update the budgetSubject
    );
  }

  // Update the budget when an arrangement is added/removed
  setBudget(newBudget: number): void {
    this.budgetSubject.next(newBudget);
  }

  // Optionally: Send the updated budget back to the API if needed
  updateBudgetOnServer(eventId: number, newBudget: number): Observable<any> {
    return this.http.post(`${this.budgetUrl}/update`, { eventId, newBudget }).pipe(
      tap(() => this.setBudget(newBudget)) // Update the local budget after saving to the server
    );
  }
}
