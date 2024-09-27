import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';  // Import ActivatedRoute to access route parameters
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EventDesignService } from '../../services/event-design.service';
import { WeddingColorsModalComponent } from '../wedding-colors-modal/wedding-colors-modal.component';

@Component({
  selector: 'app-wedding-colors',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wedding-colors.component.html',
  styleUrls: ['./wedding-colors.component.css']
})
export class WeddingColorsComponent implements OnInit {
  colors: any[] = [];
  displayedColors: any[] = [];
  currentPage: number = 0;
  colorsPerPage: number = 4;
  totalPages: number = 0;
  totalSlots: number = 10;
  eventId: number | null = null;

  constructor(
    private eventDesignService: EventDesignService,
    private modalService: NgbModal,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.eventId = Number(params.get('eventId'));
      if (this.eventId) {
        this.loadWeddingColors(this.eventId);
      }
    });
  }

  loadWeddingColors(eventId: number): void {
    this.eventDesignService.getEventWeddingColors(eventId).subscribe(
      (response) => {
        if (response.success) {
          this.colors = response.wedding_colors;
          this.updateDisplayedColors();
        } else {
          this.updateDisplayedColors();
        }
      },
      (error) => {
        console.error('Error loading wedding colors:', error);
        this.updateDisplayedColors();
      }
    );
  }

  updateDisplayedColors(): void {
    const filledColors = [...this.colors];
    const emptySlots = this.totalSlots - filledColors.length;
    const allSlots = [...filledColors, ...Array(emptySlots).fill({})];

    this.totalPages = Math.ceil(this.totalSlots / this.colorsPerPage);
    const startIndex = this.currentPage * this.colorsPerPage;
    const endIndex = startIndex + this.colorsPerPage;
    this.displayedColors = allSlots.slice(startIndex, endIndex);
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updateDisplayedColors();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.updateDisplayedColors();
    }
  }

  openWeddingColorsModal(): void {
    const modalRef = this.modalService.open(WeddingColorsModalComponent);
    modalRef.componentInstance.eventId = this.eventId;

    modalRef.result.then((selectedColor) => {
      if (selectedColor) {
        this.colors.push(selectedColor);
        this.updateDisplayedColors();
      }
    }).catch((error) => {
      console.log('Modal dismissed:', error);
    });
  }

  // Method to remove the color from the UI and backend
  removeColor(index: number, colorId: number): void {
    this.eventDesignService.removeWeddingColor(this.eventId!, colorId).subscribe(
      (response) => {
        if (response.success) {
          this.colors.splice(index, 1);  // Remove the color from the array
          this.updateDisplayedColors();  // Update the displayed colors
        } else {
          console.error('Failed to remove wedding color:', response.message);
        }
      },
      (error) => {
        console.error('Error removing wedding color:', error);
      }
    );
  }
}
