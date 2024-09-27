import { Component, OnInit, Renderer2 } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { EventDesignService } from '../../services/event-design.service';

@Component({
  selector: 'app-wedding-colors-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wedding-colors-modal.component.html',
  styleUrls: ['./wedding-colors-modal.component.css'],
})
export class WeddingColorsModalComponent implements OnInit {
  weddingColors: any[] = [];
  eventId!: number;  // Assume this is passed in from the parent component

  constructor(
    public activeModal: NgbActiveModal,
    private eventDesignService: EventDesignService,
    private renderer: Renderer2  // Inject Renderer2 to manipulate DOM
  ) {}

  ngOnInit(): void {
    this.loadWeddingColors();
    this.setBackdropZIndex();
  }

  // Load all available wedding colors
  loadWeddingColors(): void {
    this.eventDesignService.getWeddingColors().subscribe((response) => {
      if (response.success) {
        this.weddingColors = response.colors;
      }
    });
  }

  // Set the z-index of the backdrop when the modal is opened
  setBackdropZIndex(): void {
    setTimeout(() => {
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        this.renderer.setStyle(backdrop, 'z-index', '1040');  // Set the z-index of the backdrop
      }
    }, 0); // Delay to ensure the backdrop is rendered first
  }

  // Select a color and update the wedding colors for the event
  selectColor(color: any): void {
    // Call the service to update the wedding colors for this event
    this.eventDesignService.updateEventDesignWeddingColors(this.eventId, [color.id]).subscribe(response => {
      if (response.success) {
        // If the update is successful, close the modal and pass the selected color back to the parent component
        this.activeModal.close(color);
      } else {
        console.error('Failed to update wedding color:', response.message);
      }
    });
  }

  closeModal(): void {
    this.activeModal.dismiss('Modal closed');
  }
}
