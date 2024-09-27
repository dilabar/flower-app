import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WeddingStylesComponent } from '../event-design/wedding-styles/wedding-styles.component';
import { WeddingColorsComponent } from '../event-design/wedding-colors/wedding-colors.component';
import { BudgetComponent } from '../event-design/budget/budget.component';
import { PersonalsComponent } from '../event-design/personals/personals.component';
import { CeremonyComponent } from '../event-design/ceremony/ceremony.component';
import { ReceptionComponent } from '../event-design/reception/reception.component';
import { InspirationsComponent } from '../event-design/inspirations/inspirations.component';
import { EventDesignService } from '../services/event-design.service';
import { EditModeService } from '../services/edit-mode.service'; // Import the EditModeService
import { Observable } from 'rxjs';
import { SaveDesignAsATemplateModalComponent } from './save-design-as-a-template-modal/save-design-as-a-template-modal.component';
import { ApplyDesignTemplateModalComponent } from './apply-design-template-modal/apply-design-template-modal.component';

@Component({
  selector: 'app-event-design',
  standalone: true,
  imports: [
    CommonModule,
    WeddingStylesComponent,
    WeddingColorsComponent,
    BudgetComponent,
    PersonalsComponent,
    CeremonyComponent,
    ReceptionComponent,
    InspirationsComponent,
  ],
  templateUrl: './event-design.component.html',
  styleUrls: ['./event-design.component.css']
})
export class EventDesignComponent implements OnInit {
  isEditMode$: Observable<boolean>;  // Observable to track edit mode globally
  eventId: number | null = null;
  personalsCards: any[] = [];
  ceremonyCards: any[] = [];
  receptionCards: any[] = [];
  backendUrl: string = 'https://chasin619.pythonanywhere.com/uploads/';

  constructor(
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private eventDesignService: EventDesignService,
    private editModeService: EditModeService  // Inject the EditModeService
  ) {
    this.isEditMode$ = this.editModeService.isEditMode$; // Subscribe to the edit mode observable
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.eventId = Number(params.get('eventId'));
      if (this.eventId) {
        console.log(`Fetched eventId: ${this.eventId}`);
      }
    });
  }

  enterEditMode() {
    this.editModeService.setEditMode(true);  // Use the service to enable edit mode
  }

  exitEditMode() {
    this.editModeService.setEditMode(false);  // Use the service to disable edit mode
  }

  openSaveTemplateModal(): void {
    const modalRef = this.modalService.open(SaveDesignAsATemplateModalComponent, { backdrop: 'static' });
    modalRef.componentInstance.eventId = this.eventId; // Pass the eventId to the modal
  
    modalRef.result.then(() => {
      console.log('Template saved successfully');
    }).catch(error => {
      console.log('Save template modal dismissed', error);
    });
  }


  openApplyTemplateModal(): void {
    const modalRef = this.modalService.open(ApplyDesignTemplateModalComponent);
    modalRef.componentInstance.eventId = this.eventId;  // Pass the eventId to the modal
  }
}
