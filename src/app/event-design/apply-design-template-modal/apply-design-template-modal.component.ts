import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApplyEventDesignTemplateService } from '../../services/apply-event-design-template.service';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CommonModule } from '@angular/common'; // Import CommonModule for ngFor

@Component({
  selector: 'app-apply-design-template-modal',
  standalone: true,
  templateUrl: './apply-design-template-modal.component.html',
  styleUrls: ['./apply-design-template-modal.component.css'],
  imports: [FormsModule, CommonModule] // Add CommonModule
})
export class ApplyDesignTemplateModalComponent implements OnInit {
  templates: any[] = [];
  selectedTemplateId: number | null = null;
  eventId!: number;
  loading: boolean = false; // State to track the loading spinner

  constructor(
    public activeModal: NgbActiveModal,
    private applyTemplateService: ApplyEventDesignTemplateService
  ) {}

  ngOnInit(): void {
    this.applyTemplateService.fetchTemplates().subscribe({
      next: (response) => {
        if (response.success) {
          this.templates = response.templates;
        } else {
          alert('Failed to load templates: ' + response.message);
        }
      },
      error: (error) => {
        console.error('Error fetching templates:', error);
      }
    });
  }

  applyTemplate(): void {
    if (!this.selectedTemplateId) {
      alert('Please select a template');
      return;
    }

    this.loading = true; // Show loading spinner

    this.applyTemplateService.applyTemplate(this.eventId, this.selectedTemplateId).subscribe({
      next: (response) => {
        this.loading = false; // Hide loading spinner
        if (response.success) {
          alert('Template applied successfully');
          this.activeModal.close();
          window.location.reload(); // Refresh the page after template application
        } else {
          alert('Error applying template: ' + response.message);
        }
      },
      error: (error) => {
        this.loading = false; // Hide loading spinner on error
        console.error('Error applying template:', error);
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
