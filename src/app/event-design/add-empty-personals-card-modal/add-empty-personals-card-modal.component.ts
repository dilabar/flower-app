import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EventDesignService } from '../../services/event-design.service';

@Component({
  selector: 'app-add-card-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-empty-personals-card-modal.component.html',
  styleUrls: ['./add-empty-personals-card-modal.component.css']
})
export class AddEmptyPersonalsCardModalComponent {
  @Input() eventId!: number;  // Removed the section input, added eventId
  arrangementTypes: any[] = [];
  addCardForm: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private eventDesignService: EventDesignService
  ) {
    this.addCardForm = this.fb.group({
      arrangementType: [''],
      cardTitle: ['']  // Added the cardTitle input in the form
    });
  }

  ngOnInit() {
    // Fetch arrangement types
    this.eventDesignService.getArrangementTypes().subscribe((response) => {
      console.log('Arrangement Types Response:', response);
  
      this.arrangementTypes = response.arrangement_types || [];
  
      this.arrangementTypes.forEach((type, index) => {
        console.log(`Arrangement Type ${index}:`, type);
      });
  
      if (this.arrangementTypes.length === 0) {
        console.error('No arrangement types found in the response.');
      }
    }, (error) => {
      console.error('Error fetching arrangement types:', error);
    });
  }
  
  addCard(): void {
    const arrangementTypeId = +this.addCardForm.get('arrangementType')?.value;  // Convert to number
    const cardTitle = this.addCardForm.get('cardTitle')?.value;
  
    if (!arrangementTypeId || !cardTitle || !this.eventId) {  // Check if eventId is set
      console.error('Both arrangement type, card title, and event ID are required.');
      return;
    }
  
    // Ensure eventId is passed to the service
    this.eventDesignService.addEmptyPersonalsCard(this.eventId, cardTitle, arrangementTypeId).subscribe(
      (response) => {
        if (response.success) {
          console.log('Card added successfully:', response);
          this.activeModal.close(response.card_id);  // Pass back the new card ID
        } else {
          console.error('Failed to add card:', response.message);
        }
      },
      (error) => {
        console.error('Error adding card:', error);
      }
    );
  }
  
  
  cancel() {
    this.activeModal.dismiss();
  }
  ngAfterViewInit() {
    setTimeout(() => {
      const backdrop = document.querySelector('.modal-backdrop');
      const modal = document.querySelector('.modal-dialog');
      if (backdrop && modal) {
        backdrop.setAttribute('style', 'z-index: 1040 !important');
        modal.setAttribute('style', 'z-index: 1055 !important');
      }
    }, 100);
  }

}
