import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';  // Import ActivatedRoute to access route parameters
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EventDesignService } from '../../services/event-design.service';
import { WeddingStylesModalComponent } from '../wedding-styles-modal/wedding-styles-modal.component';

@Component({
  selector: 'app-wedding-styles',
  standalone: true,
  imports: [CommonModule, WeddingStylesModalComponent],  // Importing the standalone component
  templateUrl: './wedding-styles.component.html',
  styleUrls: ['./wedding-styles.component.css']
})
export class WeddingStylesComponent implements OnInit {
  styles: any[] = [];
  emptyStyles: any[] = [];
  isLoading = true;
  minCards = 3;
  eventId: number | null = null; // Initialize with null and set dynamically

  constructor(
    private eventDesignService: EventDesignService, 
    private modalService: NgbModal, 
    private route: ActivatedRoute  // Inject ActivatedRoute to get the route params
  ) {}

  ngOnInit(): void {
    // Subscribe to route parameters to get the dynamic eventId from the URL
    this.route.paramMap.subscribe(params => {
      this.eventId = Number(params.get('eventId'));  // Capture the eventId from the URL
      if (this.eventId) {
        this.loadWeddingStyles(this.eventId);  // Load wedding styles after eventId is set
      }
    });
  }

  loadWeddingStyles(eventId: number): void {
    this.eventDesignService.getEventWeddingStyles(eventId).subscribe(
      (response) => {
        if (response.success) {
          this.styles = response.wedding_styles.map((style: { image_url: any; }) => ({
            ...style,
            image_url: `https://chasin619.pythonanywhere.com${style.image_url}`
          }));
          this.updateEmptyStyles();
        } else {
          this.emptyStyles = new Array(this.minCards);
        }
        this.isLoading = false;
      },
      (error) => {
        this.emptyStyles = new Array(this.minCards);
        this.isLoading = false;
      }
    );
  }

  updateEmptyStyles(): void {
    const remainingCards = this.minCards - this.styles.length;
    this.emptyStyles = new Array(remainingCards > 0 ? remainingCards : 0);
  }

  openWeddingStylesModal(): void {
    if (this.styles.length >= this.minCards) {
      alert('You cannot add more than 3 wedding styles.');
      return;
    }

    const modalRef = this.modalService.open(WeddingStylesModalComponent);
    modalRef.componentInstance.eventId = this.eventId;  // Pass the dynamic eventId to the modal

    modalRef.result.then((selectedStyle) => {
      if (selectedStyle) {
        const imageUrl = selectedStyle.image_url.startsWith('http')
          ? selectedStyle.image_url
          : `https://chasin619.pythonanywhere.com${selectedStyle.image_url}`;  // Avoid prepending the URL twice

        // Call the API to update the event design with the selected wedding style
        this.eventDesignService.updateEventDesignWeddingStyles(this.eventId!, selectedStyle.id).subscribe(
          (response) => {
            if (response.success) {
              // Add the new wedding style to the styles array and update the empty cards
              this.styles.push({
                ...selectedStyle,
                image_url: imageUrl,
              });
              this.updateEmptyStyles();
            } else {
              console.error('Failed to update wedding style:', response.message);
            }
          },
          (error) => {
            console.error('Error updating wedding style:', error);
          }
        );
      }
    }).catch((error) => {
      console.log('Modal dismissed:', error);
    });
  }

  removeWeddingStyle(index: number): void {
    const weddingStyleId = this.styles[index].id;
    
    this.eventDesignService.removeWeddingStyle(this.eventId!, weddingStyleId).subscribe(
      (response) => {
        if (response.success) {
          // Remove from the UI
          this.styles.splice(index, 1);
          this.updateEmptyStyles();
        } else {
          console.error('Failed to remove wedding style:', response.message);
        }
      },
      (error) => {
        console.error('Error removing wedding style:', error);
      }
    );
  }
  
}
