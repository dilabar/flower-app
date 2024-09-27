import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SaveEventDesignAsTemplateService } from '../../services/save-event-design-as-template.service';
import { FormsModule } from '@angular/forms';  // Import FormsModule

@Component({
  selector: 'app-save-design-as-a-template-modal',
  standalone: true,
  templateUrl: './save-design-as-a-template-modal.component.html',
  styleUrls: ['./save-design-as-a-template-modal.component.css'],
  imports: [FormsModule]  // Add FormsModule to the imports
})
export class SaveDesignAsATemplateModalComponent {
  templateName: string = '';  // Bound to the input field
  eventId!: number;

  constructor(
    public activeModal: NgbActiveModal,
    private saveTemplateService: SaveEventDesignAsTemplateService
  ) {}

  saveTemplate(): void {
    if (!this.templateName.trim()) {
      alert('Template name is required');
      return;
    }

    this.saveTemplateService.saveTemplate(this.eventId, this.templateName).subscribe({
      next: (response) => {
        if (response.success) {
          alert('Template saved successfully');
          this.activeModal.close();
        } else {
          alert('Error saving template: ' + response.message);
        }
      },
      error: (error) => {
        alert('An error occurred while saving the template');
        console.error(error);
      }
    });
  }

  cancel(): void {
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
