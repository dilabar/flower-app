import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EditModeService {
  private editModeSubject = new BehaviorSubject<boolean>(false);  // Default value is false
  isEditMode$ = this.editModeSubject.asObservable();  // Observable for components to subscribe

  constructor() {}

  setEditMode(isEditMode: boolean): void {
    this.editModeSubject.next(isEditMode);  // Update the edit mode state
  }

  getEditModeValue(): boolean {
    return this.editModeSubject.getValue();  // Access the current edit mode value
  }
}
