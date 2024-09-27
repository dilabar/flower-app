import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EventDesignService } from '../../services/event-design.service';

@Component({
  selector: 'app-add-empty-reception-card-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-empty-reception-card-modal.component.html',
  styleUrls: ['./add-empty-reception-card-modal.component.css']
})
export class AddEmptyReceptionCardModalComponent {
  @Input() eventId!: number;
  arrangementTypes: any[] = [];
  addCardForm: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private eventDesignService: EventDesignService
  ) {
    this.addCardForm = this.fb.group({
      arrangementType: [''],
      cardTitle: ['']
    });
  }

  ngOnInit() {
    // Fetch arrangement types for the reception section
    this.eventDesignService.getArrangementTypes().subscribe((response) => {
      console.log('Arrangement Types Response:', response);

      this.arrangementTypes = response.arrangement_types || [];
      if (this.arrangementTypes.length === 0) {
        console.error('No arrangement types found in the response.');
      }
    }, (error) => {
      console.error('Error fetching arrangement types:', error);
    });
  }

  addCard(): void {
    const arrangementTypeId = +this.addCardForm.get('arrangementType')?.value;
    const cardTitle = this.addCardForm.get('cardTitle')?.value;

    if (!arrangementTypeId || !cardTitle || !this.eventId) {
      console.error('Arrangement type, card title, and event ID are required.');
      return;
    }

    this.eventDesignService.addEmptyReceptionCard(this.eventId, cardTitle, arrangementTypeId).subscribe(
      (response) => {
        if (response.success) {
          console.log('Reception card added successfully:', response);
          this.activeModal.close(response.card_id);
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
