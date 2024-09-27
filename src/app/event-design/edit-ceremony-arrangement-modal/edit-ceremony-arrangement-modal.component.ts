import { Component, Input, OnInit } from '@angular/core';
import { EventDesignService } from '../../services/event-design.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-ceremony-arrangement-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],  // Include CommonModule and FormsModule
  templateUrl: './edit-ceremony-arrangement-modal.component.html',
  styleUrls: ['./edit-ceremony-arrangement-modal.component.css']
})
export class EditCeremonyArrangementModalComponent implements OnInit {
  @Input() arrangementTypeId!: number;  // Passed from the parent component
  @Input() card: any;  // The card data
  @Input() eventId!: number;

  arrangements: any[] = [];
  filteredArrangements: any[] = [];
  paginatedArrangements: any[] = [];
  searchTerm: string = '';

  // Pagination variables
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalItems: number = 0;

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

  // Fetch arrangements by type
  loadArrangements(): void {
    this.eventDesignService.getArrangementsByType(this.arrangementTypeId).subscribe(
      (response) => {
        if (response.success) {
          this.arrangements = response.arrangements.map((arrangement: any) => ({
            ...arrangement,
            image_filename: this.formatImageUrl(arrangement.image_filename)
          }));
          this.filteredArrangements = this.arrangements;  // Initialize filtered arrangements
          this.totalItems = this.filteredArrangements.length;  // Set total items for pagination
          this.paginateArrangements();  // Set initial pagination
        } else {
          console.error('Failed to load arrangements:', response.message);
        }
      },
      (error) => {
        console.error('Error loading arrangements:', error);
      }
    );
  }

  // Pagination logic
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

  // Search filter logic
  filterArrangements(): void {
    this.filteredArrangements = this.arrangements.filter(arrangement =>
      arrangement.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.totalItems = this.filteredArrangements.length;
    this.currentPage = 1;  // Reset to the first page after filtering
    this.paginateArrangements();
  }

  // Select a new arrangement
  selectArrangement(arrangement: any): void {
    this.activeModal.close(arrangement);
  }

  close(): void {
    this.activeModal.dismiss();
  }

  formatImageUrl(filename: string): string {
    if (!filename) {
      return 'https://chasin619.pythonanywhere.com/uploads/no_image.png';  // Default image
    }
    if (filename.startsWith('//s3')) {
      return 'https:' + filename;  // Format S3 URLs
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
