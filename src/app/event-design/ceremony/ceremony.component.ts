import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InspirationsComponent } from '../inspirations/inspirations.component';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EventDesignService } from '../../services/event-design.service';
import { EditCeremonyArrangementModalComponent } from '../edit-ceremony-arrangement-modal/edit-ceremony-arrangement-modal.component';
import { AddCeremonyArrangementModalComponent } from '../add-ceremony-arrangement-modal/add-ceremony-arrangement-modal.component';
import { EditModeService } from '../../services/edit-mode.service';
import { AddEmptyCeremonyCardModalComponent } from '../add-empty-ceremony-card-modal/add-empty-ceremony-card-modal.component';
import { Observable } from 'rxjs';
import { BudgetService } from '../../services/budget.service'; // Import BudgetService

@Component({
  selector: 'app-ceremony',
  standalone: true,
  imports: [CommonModule, InspirationsComponent],
  templateUrl: './ceremony.component.html',
  styleUrls: ['./ceremony.component.css']
})
export class CeremonyComponent implements OnInit {
  ceremonyCards: any[] = [];
  eventId!: number;
  backendUrl: string = 'https://chasin619.pythonanywhere.com/uploads/';
  isEditMode$: Observable<boolean>;

  constructor(
    private route: ActivatedRoute,
    private eventDesignService: EventDesignService,
    private modalService: NgbModal,
    private editModeService: EditModeService,
    private budgetService: BudgetService // Inject BudgetService
  ) {
    this.isEditMode$ = this.editModeService.isEditMode$;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.eventId = +params.get('eventId')!;
      this.loadCeremony();
      this.loadBudget(); // Load the initial budget on component initialization
    });
  }

  loadCeremony(): void {
    this.eventDesignService.getEventCeremony(this.eventId).subscribe(
      (response) => {
        if (response.success) {
          this.ceremonyCards = response.ceremony.map((card: any) => ({
            ...card,
            image_url: this.formatImageUrl(card.image_filename), // Format the image URL correctly
            arrangementTypeId: card.type_id,
            arrangementTypeName: card.type_name,
            arrangement_id: card.arrangement_id || null
          }));
        } else {
          console.error('Failed to load ceremony:', response.message);
        }
      },
      (error) => {
        console.error('Error loading ceremony:', error);
      }
    );
  }

  openEditModal(card: any): void {
    if (!card.arrangementTypeId) {
      console.error('arrangementTypeId is missing from card data:', card);
      return;
    }

    const modalRef = this.modalService.open(EditCeremonyArrangementModalComponent, { backdrop: 'static' });
    modalRef.componentInstance.arrangementTypeId = card.arrangementTypeId;
    modalRef.componentInstance.arrangementTypeName = card.arrangementTypeName;
    modalRef.componentInstance.card = card;
    modalRef.componentInstance.eventId = this.eventId;

    modalRef.result.then((newArrangement) => {
      if (newArrangement) {
        this.updateCardWithNewArrangement(card, newArrangement);
        this.updateBudget(); // Update budget after editing an arrangement
      }
    }).catch((error) => console.log('Modal dismissed:', error));
  }

  openAddModal(card: any): void {
    const modalRef = this.modalService.open(AddCeremonyArrangementModalComponent, { backdrop: 'static' });
    modalRef.componentInstance.arrangementTypeId = card.arrangementTypeId;
    modalRef.componentInstance.arrangementTypeName = card.arrangementTypeName;
    modalRef.componentInstance.eventId = this.eventId;

    modalRef.result.then((newArrangementId) => {
      if (newArrangementId) {
        this.addNewArrangementToCard(card, newArrangementId);
      }
    }).catch((error) => console.log('Modal dismissed:', error));
  }

  addNewArrangementToCard(card: any, newArrangementId: number): void {
    this.eventDesignService.addCeremonyArrangement(this.eventId, newArrangementId, card.id).subscribe(
      (response) => {
        if (response.success) {
          this.loadCeremony();
          this.updateBudget(); // Update budget after adding an arrangement
        } else {
          console.error('Failed to add new arrangement:', response.message);
        }
      },
      (error) => {
        console.error('Failed to add new arrangement to the database:', error);
      }
    );
  }

  updateCardWithNewArrangement(card: any, newArrangement: any): void {
    this.eventDesignService.updateCeremonyArrangement(this.eventId, card.id, newArrangement.id).subscribe(
      (response) => {
        if (response.success) {
          this.loadCeremony();
          this.updateBudget(); // Update budget after editing an arrangement
        } else {
          console.error('Failed to update arrangement:', response.message);
        }
      },
      (error) => {
        console.error('Failed to update arrangement in the database:', error);
      }
    );
  }

  removeArrangement(card: any): void {
    if (!card.id) {
      console.warn('No card ID to remove for this card:', card);
      return;
    }

    this.eventDesignService.removeCeremony(this.eventId, card.id).subscribe(
      (response) => {
        if (response.success) {
          card.image_filename = null;
          card.image_url = null;
          card.arrangement_id = null;
          console.log('Arrangement successfully removed');
          this.updateBudget(); // Update budget after removing an arrangement
        } else {
          console.error('Failed to remove arrangement:', response.message);
        }
      },
      (error) => {
        console.error('Failed to remove arrangement from the database:', error);
      }
    );
  }

  openAddEmptyCardModal(): void {
    const modalRef = this.modalService.open(AddEmptyCeremonyCardModalComponent, { backdrop: 'static' });
    modalRef.componentInstance.eventId = this.eventId;

    modalRef.result.then((newCardId) => {
      if (newCardId) {
        this.loadCeremony();
      }
    }).catch((error) => console.log('Modal dismissed:', error));
  }

  saveTitleChange(card: any, event: any): void {
    const newTitle = event.target.textContent.trim();
    if (newTitle !== card.card_title) {
      this.eventDesignService.updateCeremonyCardTitle(card.id, newTitle).subscribe(
        (response) => {
          if (response.success) {
            card.card_title = newTitle;
          } else {
            console.error('Failed to update title:', response.message);
          }
        },
        (error) => {
          console.error('Error updating title:', error);
        }
      );
    }
  }

  formatImageUrl(filename: string): string {
    if (!filename) {
      return filename; // Return a default image if the filename is empty
    }
    if (filename.startsWith('//s3')) {
      return 'https:' + filename; // Correctly format S3 URLs
    }
    return 'https://chasin619.pythonanywhere.com/uploads/' + filename; // Return the local Flask uploads URL for local filenames
  }

  // Helper function to update the budget by calling the API
  private updateBudget(): void {
    this.budgetService.getBudget(this.eventId).subscribe(
      (budget) => {
        console.log('Budget updated:', budget);
        localStorage.setItem('budget', budget.toString()); // Store the budget in local storage
      },
      (error) => {
        console.error('Error updating budget:', error);
      }
    );
  }

  // Load initial budget on component load
  private loadBudget(): void {
    this.budgetService.getBudget(this.eventId).subscribe(
      (budget) => {
        console.log('Initial budget loaded:', budget);
        localStorage.setItem('budget', budget.toString()); // Store the initial budget in local storage
      },
      (error) => {
        console.error('Error loading initial budget:', error);
      }
    );
  }


  removeCeremonyCard(card: any): void {
    if (!card.id) {
      console.warn('No card ID to remove for this card:', card);
      return;
    }
  
    this.eventDesignService.removeCeremonyCard(this.eventId, card.id).subscribe(
      (response) => {
        if (response.success) {
          // Reload the ceremony cards to reflect the removal
          this.loadCeremony();
          console.log('Ceremony card successfully removed');
          this.updateBudget(); // Update budget after removing the card
        } else {
          console.error('Failed to remove ceremony card:', response.message);
        }
      },
      (error) => {
        console.error('Failed to remove ceremony card from the database:', error);
      }
    );
  }
  

}
