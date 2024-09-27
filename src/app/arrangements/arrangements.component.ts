import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ArrangementsService } from '../services/arrangements.service';
import { ArrangementModalComponent } from './arrangement-modal/arrangement-modal.component';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-arrangements',
  templateUrl: './arrangements.component.html',
  styleUrls: ['./arrangements.component.css'],
  standalone: true,
  imports: [CommonModule,FormsModule]
})
export class ArrangementsComponent implements OnInit {
  arrangements: any[] = [];
  userId = 1;
  // flaskServerUrl = 'https://chasin619.pythonanywhere.com/uploads/';
  flaskServerUrl = 'http://localhost:5000/uploads/';
  currentPage: number = 1;
  perPage: number = 10; // Number of arrangements per page
  totalArrangements: number = 0;
  totalPages: number = 0;

  // For tracking hover events
  hoveredName: number | null = null;
  hoveredDescription: number | null = null;
  hoveredIngredients: number | null = null;
  filteredArrangements:any[]; // This will hold the filtered results
  searchTerm: string = '';
  listView: boolean = false;
  colorChoices: any[]=[];
  typeChoices: any[]=[];
  searchDescription: string = '';
  searchName: string = '';
  searchColor: string = '';
  searchType: string = '';
  isAscending: boolean = true; 

  constructor(
    private arrangementsService: ArrangementsService,
    private modalService: NgbModal
  ) {
    this.filteredArrangements = this.arrangements;
  }

  ngOnInit(): void {
    this.loadArrangements();
    this.loadTypeChoices();
    this.loadColorChoices();
  }
  searchArrangements() {

    
    this.filteredArrangements = this.arrangements.filter(arrangement => {
        const matchesDescription = this.searchDescription ? 
            arrangement.name.toLowerCase().includes(this.searchDescription.toLowerCase()) : true;

        const matchesName = this.searchName ? 
            arrangement.name.toLowerCase().includes(this.searchName.toLowerCase()) : true;

        const matchesColor = this.searchColor ? 
            arrangement.colors.includes(this.searchColor) : true;

        const matchesType = this.searchType ? 
            arrangement.type_name.includes(this.searchType) : true;

        return matchesDescription && matchesName && matchesColor && matchesType;
    });
        // Reset to the first page whenever a search is performed
        // this.currentPage = 1;
        this.totalArrangements = this.filteredArrangements.length;
        // this.totalPages = Math.ceil(this.totalArrangements / this.perPage);

}

  loadArrangements(): void {
    this.arrangementsService.getArrangements(this.userId, this.currentPage, this.perPage).subscribe(
      (response) => {
        if (response && response.arrangements) {
          this.arrangements = response.arrangements.map((arrangement: { image_filename: string; }) => {
            return {
              ...arrangement,
              image_filename: this.formatImageUrl(arrangement.image_filename)
            };
          });
          this.totalArrangements = response.total;
          this.totalPages = response.pages;
          this.updateFilteredArrangements(); // Update displayed arrangements
        }
      },
      (error) => {
        console.error('Error loading arrangements:', error);
      }
    );
  }
  loadTypeChoices(): void {
    this.arrangementsService.getTypeChoices().subscribe((response: any) => {
      this.typeChoices = response.types || [];

     
    });
  }

  loadColorChoices(): void {
    this.arrangementsService.getColorChoices().subscribe((response: any) => {
      this.colorChoices = response.colors || [];
     
    });
  }

  formatImageUrl(filename: string): string {
    if (filename.startsWith('//s3')) {
      return 'https:' + filename; // Converts S3 links to proper URLs
    }
    return this.flaskServerUrl + filename; // Prefixes non-S3 filenames with the Flask uploads URL
  }
  
  openModal(arrangement: any,mtype='edit'): void {
    console.log("modal ",arrangement);
    

    if(mtype=='edit'){
    // Fetch the arrangement details by ID to ensure all data is available
      this.arrangementsService.getArrangement(arrangement.id).subscribe(
        (response: any) => {
          const modalRef = this.modalService.open(ArrangementModalComponent,{ windowClass: 'gray', size: 'lg' });
          modalRef.componentInstance.mtype = mtype;
          
          modalRef.componentInstance.arrangementobj = response; // Use the fetched arrangement data
          modalRef.componentInstance.ingredients = arrangement.ingredients;
          modalRef.componentInstance.colors = arrangement.colors;
          modalRef.componentInstance.wedding_styles = arrangement.wedding_styles;
          modalRef.result.then((updatedArrangement) => {
            if (updatedArrangement) {
              this.updateArrangementInList(updatedArrangement);
            }
            this.loadArrangements();
          }).catch((error) => {
            console.log('Modal closed:', error);
          this.loadArrangements();

          });
        },
        (error) => {
          console.error('Error fetching arrangement details:', error);
        }
      );
    }
    else{
      const modalRef = this.modalService.open(ArrangementModalComponent,{ windowClass: 'gray', size: 'lg' });
          modalRef.componentInstance.mtype = mtype;
          modalRef.result.then((updatedArrangement) => {
            if (updatedArrangement) {
              this.updateArrangementInList(updatedArrangement);
            }
            this.loadArrangements();
          }).catch((error) => {
            console.log('Modal closed:', error);
          });
    }

 
  }
  

  updateArrangementInList(updatedArrangement: any): void {
    const index = this.arrangements.findIndex(a => a.id === updatedArrangement.id);
    if (index !== -1) {
      this.arrangements[index] = updatedArrangement;
    }
  }

  onImageError(event: any): void {
    const defaultImage = this.flaskServerUrl + 'no_image.png';
    if (event.target.src !== defaultImage) {
      event.target.src = defaultImage;
    }
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.loadArrangements(); // Fetch arrangements for the new page
        // this.searchArrangements(); // Reapply filters based on current search criteria
    }
}

  // Event handlers for hover events
  onHoverName(id: number): void {
    this.hoveredName = id;
  }

  onHoverDescription(id: number): void {
    this.hoveredDescription = id;
  }

  onHoverIngredients(id: number): void {
    this.hoveredIngredients = id;
  }

  onLeaveHover(): void {
    this.hoveredName = null;
    this.hoveredDescription = null;
    this.hoveredIngredients = null;
  }
  switchToListView(): void {
    this.listView = true;
  }

  switchToGalleryView(): void {
    this.listView = false;
  }
  showIngredients(event: any) {
    event.target.previousElementSibling.style.opacity = '1'; // Show the overlay
  }
  
  hideIngredients(event: any) {
    event.target.previousElementSibling.style.opacity = '0'; // Hide the overlay
  }
    // Reset filters and display all arrangements again
    resetFilters(): void {
      this.searchDescription = '';
      this.searchName = '';
      this.searchColor = '';
      this.searchType = '';
      this.filteredArrangements = [...this.arrangements]; // Reset to original arrangements
    }
    toggleSort() {
      this.isAscending = !this.isAscending; // Toggle the sort direction
      // this.sortArrangements(); // Call the function to sort the arrangements based on the current direction
  }
  updateFilteredArrangements(): void {
    const startIndex = (this.currentPage - 1) * this.perPage;
    const endIndex = startIndex + this.perPage;
    this.filteredArrangements = this.arrangements;
  }
}
