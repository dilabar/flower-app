import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventDesignService } from '../../services/event-design.service';

@Component({
  selector: 'app-add-ceremony-arrangement-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-ceremony-arrangement-modal.component.html',
  styleUrls: ['./add-ceremony-arrangement-modal.component.css']
})
export class AddCeremonyArrangementModalComponent implements OnInit {
  arrangementTypeId!: number;
  arrangements: any[] = [];
  filteredArrangements: any[] = [];
  paginatedArrangements: any[] = [];
  searchTerm: string = '';

  // Pagination variables
  currentPage: number = 1;
  itemsPerPage: number = 6; // Number of items per page
  totalItems: number = 0;

  constructor(
    public activeModal: NgbActiveModal,
    private eventDesignService: EventDesignService
  ) {}

  ngOnInit(): void {
    this.loadArrangementsByType();
  }

  loadArrangementsByType(): void {
    this.eventDesignService
      .getArrangementsByType(this.arrangementTypeId)
      .subscribe(
        (response) => {
          if (response.success) {
            this.arrangements = response.arrangements.map((arrangement: any) => ({
              ...arrangement,
              image_filename: this.formatImageUrl(arrangement.image_filename) // Format the image URL
            }));
            this.filteredArrangements = this.arrangements; // Initialize filteredArrangements
            this.totalItems = this.filteredArrangements.length;
            this.paginateArrangements(); // Set initial pagination
          } else {
            console.error('Failed to load arrangements:', response.message);
          }
        },
        (error) => {
          console.error('Error loading arrangements:', error);
        }
      );
  }

  paginateArrangements(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedArrangements = this.filteredArrangements.slice(startIndex, endIndex);
  }

  selectArrangement(arrangementId: number): void {
    this.activeModal.close(arrangementId); // Return the selected arrangement ID
  }

  close(): void {
    this.activeModal.dismiss();
  }

  formatImageUrl(filename: string): string {
    if (!filename) {
      return 'https://chasin619.pythonanywhere.com/uploads/no_image.png'; // Return a default image if the filename is empty
    }
    if (filename.startsWith('//s3')) {
      return 'https:' + filename; // Correctly format S3 URLs
    }
    return 'https://chasin619.pythonanywhere.com/uploads/' + filename; // For local files, append the backend URL
  }

  filterArrangements(): void {
    this.filteredArrangements = this.arrangements.filter(arrangement =>
      arrangement.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.totalItems = this.filteredArrangements.length;
    this.currentPage = 1; // Reset to the first page after filtering
    this.paginateArrangements();
  }

  // Navigate to the next page
  nextPage(): void {
    if (this.currentPage * this.itemsPerPage < this.totalItems) {
      this.currentPage++;
      this.paginateArrangements();
    }
  }

  // Navigate to the previous page
  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateArrangements();
    }
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
