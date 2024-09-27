import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InspirationsComponent } from '../inspirations/inspirations.component';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EventDesignService } from '../../services/event-design.service';
import { EditPersonalsArrangementModalComponent } from '../edit-personals-arrangement-modal/edit-personals-arrangement-modal.component';
import { AddPersonalsArrangementModalComponent } from '../add-personals-arrangement-modal/add-personals-arrangement-modal.component';
import { Observable } from 'rxjs';
import { EditModeService } from '../../services/edit-mode.service';
import { AddEmptyPersonalsCardModalComponent } from '../add-empty-personals-card-modal/add-empty-personals-card-modal.component';
import { BudgetService } from '../../services/budget.service'; // Import BudgetService

@Component({
  selector: 'app-personals',
  standalone: true,
  imports: [CommonModule, InspirationsComponent],
  templateUrl: './personals.component.html',
  styleUrls: ['./personals.component.css']
})
export class PersonalsComponent implements OnInit {
  personalsCards: any[] = [];
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
      this.loadPersonals();
      this.loadBudget(); // Load the initial budget on component initialization
    });
  }

  loadPersonals(): void {
    this.eventDesignService.getEventPersonals(this.eventId).subscribe(
      (response) => {
        if (response.success) {
          this.personalsCards = response.personals.map((card: any) => {
            const personalsCard = {
              ...card,
              image_url: this.formatImageUrl(card.image_filename), // Format the image URL correctly
              arrangementTypeId: card.type_id,
              arrangementTypeName: card.type_name, // Pass type_name for display
              arrangement_id: card.arrangement_id || null
            };
            console.log('Card loaded:', personalsCard);
            return personalsCard;
          });
        } else {
          console.error('Failed to load personals:', response.message);
        }
      },
      (error) => {
        console.error('Error loading personals:', error);
      }
    );
  }

  openEditModal(card: any): void {
    console.log('Opening edit modal for card:', card);

    if (!card.arrangementTypeId) {
      console.error('arrangementTypeId is missing from card data:', card);
      return;
    }

    const modalRef = this.modalService.open(EditPersonalsArrangementModalComponent, { backdrop: 'static' });
    modalRef.componentInstance.arrangementTypeId = card.arrangementTypeId;
    modalRef.componentInstance.arrangementTypeName = card.arrangementTypeName; // Pass the arrangement type name
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
    const modalRef = this.modalService.open(AddPersonalsArrangementModalComponent, { backdrop: 'static' });
    modalRef.componentInstance.arrangementTypeId = card.arrangementTypeId;
    modalRef.componentInstance.arrangementTypeName = card.arrangementTypeName; // Pass the arrangement type name
    modalRef.componentInstance.eventId = this.eventId;

    modalRef.result.then((newArrangementId) => {
      if (newArrangementId) {
        this.addNewArrangementToCard(card, newArrangementId); // Pass the card object
      }
    }).catch((error) => console.log('Modal dismissed:', error));
  }

  addNewArrangementToCard(card: any, newArrangementId: number): void {
    this.eventDesignService.addPersonalArrangement(this.eventId, newArrangementId, card.id).subscribe( // Pass card.id
      (response) => {
        if (response.success) {
          this.loadPersonals();
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
    console.log('Updating card with new arrangement:');
    console.log('Card:', card);
    console.log('New Arrangement:', newArrangement);

    this.eventDesignService.updatePersonalArrangement(this.eventId, card.id, newArrangement.id).subscribe(
      (response) => {
        if (response.success) {
          console.log('Arrangement updated successfully:', response);
          this.loadPersonals(); // Refresh the personals list after update
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

    this.eventDesignService.removePersonal(this.eventId, card.id).subscribe(
      (response) => {
        if (response.success) {
          // Clear card details on success
          card.image_filename = null;
          card.image_url = null;
          card.arrangement_id = null; // Reset the arrangement ID
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
    const modalRef = this.modalService.open(AddEmptyPersonalsCardModalComponent, { backdrop: 'static' });
    modalRef.componentInstance.eventId = this.eventId; // Pass the event ID

    modalRef.result.then((newCardId) => {
      if (newCardId) {
        this.loadPersonals(); // Reload the personals to show the new card
      }
    }).catch((error) => console.log('Modal dismissed:', error));
  }

  // Save title change when user clicks out or presses Enter
  saveTitleChange(card: any, event: any): void {
    const newTitle = event.target.textContent.trim();
    if (newTitle !== card.card_title) {
      this.eventDesignService.updatePersonalCardTitle(card.id, newTitle).subscribe( // Pass only 2 arguments
        (response) => {
          if (response.success) {
            console.log('Title updated successfully:', response);
            card.card_title = newTitle; // Update title in the UI
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
    return this.backendUrl + filename; // Return the local Flask uploads URL for local filenames
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



  removePersonalsCard(card: any): void {
    if (!card.id) {
      console.warn('No card ID to remove:', card);
      return;
    }
  
    this.eventDesignService.removePersonalsCard(this.eventId, card.id).subscribe(
      (response) => {
        if (response.success) {
          this.loadPersonals(); // Reload the personals to reflect the removal
          this.updateBudget(); // Update budget after removing the card
        } else {
          console.error('Failed to remove personals card:', response.message);
        }
      },
      (error) => {
        console.error('Error removing personals card:', error);
      }
    );
  }
  

}
