import { Component, Input, OnInit } from '@angular/core';
import { EventDesignService } from '../../services/event-design.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule

@Component({
  selector: 'app-edit-reception-arrangement-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],  // Include FormsModule for ngModel
  templateUrl: './edit-reception-arrangement-modal.component.html',
  styleUrls: ['./edit-reception-arrangement-modal.component.css']
})
export class EditReceptionArrangementModalComponent implements OnInit {
  @Input() arrangementTypeId!: number;
  @Input() card: any;
  @Input() eventId!: number;

  arrangements: any[] = [];
  filteredArrangements: any[] = []; // Filtered array for search
  searchTerm: string = ''; // Search term

  // Pagination variables
  currentPage: number = 1;
  itemsPerPage: number = 6; // Number of items per page
  totalItems: number = 0;
  paginatedArrangements: any[] = [];

  constructor(
    private eventDesignService: EventDesignService,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    if (!this.arrangementTypeId) {
      console.error('arrangementTypeId is undefined or invalid');
      return;
    }
    this.loadArrangements();
  }

  loadArrangements(): void {
    this.eventDesignService.getArrangementsByType(this.arrangementTypeId).subscribe(
      (response) => {
        if (response.success) {
          this.arrangements = response.arrangements.map((arrangement: any) => ({
            ...arrangement,
            image_filename: this.formatImageUrl(arrangement.image_filename)
          }));
          this.filteredArrangements = this.arrangements; // Initialize filteredArrangements
          this.totalItems = this.filteredArrangements.length; // Set total items for pagination
          this.paginateArrangements(); // Initialize pagination
        } else {
          console.error('Failed to load arrangements:', response.message);
        }
      },
      (error) => {
        console.error('Error loading arrangements:', error);
      }
    );
  }

  // Filter arrangements based on the search term
  filterArrangements(): void {
    this.filteredArrangements = this.arrangements.filter(arrangement =>
      arrangement.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.totalItems = this.filteredArrangements.length; // Update total items count after filtering
    this.currentPage = 1; // Reset to the first page after filtering
    this.paginateArrangements(); // Paginate the filtered results
  }

  // Handle pagination
  paginateArrangements(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedArrangements = this.filteredArrangements.slice(startIndex, endIndex);
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

  selectArrangement(arrangement: any): void {
    this.activeModal.close(arrangement);
  }

  formatImageUrl(filename: string): string {
    if (!filename) {
      return 'https://chasin619.pythonanywhere.com/uploads/no_image.png';
    }
    if (filename.startsWith('//s3')) {
      return 'https:' + filename;
    }
    return 'https://chasin619.pythonanywhere.com/uploads/' + filename;
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
