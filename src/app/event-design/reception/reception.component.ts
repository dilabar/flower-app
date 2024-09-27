import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { EventDesignService } from '../../services/event-design.service';
import { EditReceptionArrangementModalComponent } from '../edit-reception-arrangement-modal/edit-reception-arrangement-modal.component';
import { AddReceptionArrangementModalComponent } from '../add-reception-arrangement-modal/add-reception-arrangement-modal.component';
import { InspirationsComponent } from '../inspirations/inspirations.component';
import { EditModeService } from '../../services/edit-mode.service';
import { AddEmptyReceptionCardModalComponent } from '../add-empty-reception-card-modal/add-empty-reception-card-modal.component';
import { Observable } from 'rxjs';
import { BudgetService } from '../../services/budget.service'; // Import BudgetService

@Component({
  selector: 'app-reception',
  standalone: true,
  imports: [CommonModule, InspirationsComponent],
  templateUrl: './reception.component.html',
  styleUrls: ['./reception.component.css']
})
export class ReceptionComponent implements OnInit {
  receptionCards: any[] = [];
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
      this.loadReception();
      this.loadBudget(); // Load the initial budget when the component is initialized
    });
  }

  loadReception(): void {
    this.eventDesignService.getEventReception(this.eventId).subscribe(
      (response) => {
        if (response.success) {
          this.receptionCards = response.reception.map((card: any) => ({
            ...card,
            image_url: this.formatImageUrl(card.image_filename), // Format the image URL
            arrangementTypeId: card.type_id,
            arrangementTypeName: card.type_name,
            arrangement_id: card.arrangement_id || null
          }));
        } else {
          console.error('Failed to load reception:', response.message);
        }
      },
      (error) => {
        console.error('Error loading reception:', error);
      }
    );
  }

  openEditModal(card: any): void {
    if (!card.arrangementTypeId) {
      console.error('arrangementTypeId is missing from card data:', card);
      return;
    }

    const modalRef = this.modalService.open(EditReceptionArrangementModalComponent, { backdrop: 'static' });
    modalRef.componentInstance.arrangementTypeId = card.arrangementTypeId;
    modalRef.componentInstance.arrangementTypeName = card.arrangementTypeName;
    modalRef.componentInstance.card = card;
    modalRef.componentInstance.eventId = this.eventId;

    modalRef.result.then((newArrangement) => {
      if (newArrangement) {
        this.updateCardWithNewArrangement(card, newArrangement);
        this.updateBudget(); // Update the budget after editing an arrangement
      }
    }).catch((error) => console.log('Modal dismissed:', error));
  }

  openAddModal(card: any): void {
    const modalRef = this.modalService.open(AddReceptionArrangementModalComponent, { backdrop: 'static' });
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
    this.eventDesignService.addReceptionArrangement(this.eventId, newArrangementId, card.id).subscribe(
      (response) => {
        if (response.success) {
          this.loadReception();
          this.updateBudget(); // Update the budget after adding a new arrangement
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
    this.eventDesignService.updateReceptionArrangement(this.eventId, card.id, newArrangement.id).subscribe(
      (response) => {
        if (response.success) {
          this.loadReception();
          this.updateBudget(); // Update the budget after editing an arrangement
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

    this.eventDesignService.removeReception(this.eventId, card.id).subscribe(
      (response) => {
        if (response.success) {
          card.image_filename = null;
          card.image_url = null;
          card.arrangement_id = null;
          console.log('Arrangement successfully removed');
          this.updateBudget(); // Update the budget after removing an arrangement
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
    const modalRef = this.modalService.open(AddEmptyReceptionCardModalComponent, { backdrop: 'static' });
    modalRef.componentInstance.eventId = this.eventId;

    modalRef.result.then((newCardId) => {
      if (newCardId) {
        this.loadReception();
      }
    }).catch((error) => console.log('Modal dismissed:', error));
  }

  saveTitleChange(card: any, event: any): void {
    const newTitle = event.target.textContent.trim();
    if (newTitle !== card.card_title) {
      this.eventDesignService.updateReceptionCardTitle(card.id, newTitle).subscribe(
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
    return 'https://chasin619.pythonanywhere.com/uploads/' + filename; // For local files, append the backend URL
  }

  // Helper function to update the budget by calling the API
  private updateBudget(): void {
    this.budgetService.getBudget(this.eventId).subscribe(
      (budget) => {
        console.log('Budget updated:', budget);
        localStorage.setItem('budget', budget.toString()); // Store the updated budget in local storage
      },
      (error) => {
        console.error('Error updating budget:', error);
      }
    );
  }

  // Load the initial budget when the component is loaded
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

  removeReceptionCard(card: any): void {
    if (!card.id) {
      console.warn('No card ID to remove for this card:', card);
      return;
    }
  
    this.eventDesignService.removeReceptionCard(this.eventId, card.id).subscribe(
      (response) => {
        if (response.success) {
          // Reload the reception cards to reflect the removal
          this.loadReception();
          console.log('Reception card successfully removed');
          this.updateBudget(); // Update the budget after removing the card
        } else {
          console.error('Failed to remove reception card:', response.message);
        }
      },
      (error) => {
        console.error('Failed to remove reception card from the database:', error);
      }
    );
  }
  

}
