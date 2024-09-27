import { Component, OnInit, Renderer2 } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { EventDesignService } from '../../services/event-design.service';

@Component({
  selector: 'app-wedding-styles-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wedding-styles-modal.component.html',
  styleUrls: ['./wedding-styles-modal.component.css'],
})
export class WeddingStylesModalComponent implements OnInit {
  weddingStyles: any[] = [];
  eventId!: number; // Event ID passed from the parent component
  selectedStyles: number[] = []; // List to keep track of selected wedding style IDs

  constructor(
    public activeModal: NgbActiveModal,
    private eventDesignService: EventDesignService,
    private renderer: Renderer2 // Inject Renderer2 to manipulate DOM
  ) {}

  ngOnInit(): void {
    this.loadWeddingStyles();
    this.adjustModalZIndex();
  }

  // Load all available wedding styles
  loadWeddingStyles(): void {
    this.eventDesignService.getWeddingStyles().subscribe((response) => {
      if (response.success) {
        this.weddingStyles = response.wedding_styles.map((style: any) => {
          return {
            ...style,
            image_url: style.image_url.startsWith('http') ? style.image_url : `https://chasin619.pythonanywhere.com${style.image_url}`, // Ensure no double URL
          };
        });
      }
    });
  }

  // Handle style selection and update the list of selected styles
  selectStyle(style: any): void {
    // Add the selected style ID to the list of selected styles
    this.selectedStyles.push(style.id);

    // Call the service to update the wedding styles for this event
    this.eventDesignService.updateEventDesignWeddingStyles(this.eventId, this.selectedStyles).subscribe(response => {
      if (response.success) {
        // Close the modal and pass the selected style back to the parent component
        this.activeModal.close(style);
      } else {
        console.error('Failed to update wedding style:', response.message);
      }
    });
  }

  // Close the modal without making any changes
  closeModal(): void {
    this.activeModal.dismiss('Modal closed');
  }

  // Adjust the z-index for modal and backdrop
  adjustModalZIndex(): void {
    setTimeout(() => {
      const modals = document.getElementsByClassName('modal');
      const backdrops = document.getElementsByClassName('modal-backdrop');

      if (modals.length > 0 && backdrops.length > 0) {
        // Set modal z-index to be higher than the backdrop
        const modal = modals[0] as HTMLElement;
        const backdrop = backdrops[0] as HTMLElement;

        this.renderer.setStyle(modal, 'z-index', '1060');
        this.renderer.setStyle(backdrop, 'z-index', '1050');
      }
    });
  }
}
