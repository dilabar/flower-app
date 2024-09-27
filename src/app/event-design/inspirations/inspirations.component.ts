import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventDesignService } from '../../services/event-design.service';
import { ActivatedRoute } from '@angular/router';  // Import ActivatedRoute to capture route parameters

@Component({
  selector: 'app-inspirations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inspirations.component.html',
  styleUrls: ['./inspirations.component.css']
})
export class InspirationsComponent implements OnInit {
  @Input() section: string = 'personals'; // Example default value
  inspirations: any[] = []; // Loaded inspiration items
  displayedInspirations: any[] = [];  // Always contains 5 elements
  eventId: number | null = null;  // Initialize with null to capture it dynamically
  totalCards = 5;  // We always want 5 inspiration cards per section

  // Define the correct backend URL for uploaded files
  backendUrl: string = 'https://chasin619.pythonanywhere.com/uploads/';

  constructor(
    private eventDesignService: EventDesignService,
    private route: ActivatedRoute  // Inject ActivatedRoute to capture the route params
  ) {}

  ngOnInit(): void {
    // Subscribe to route parameters to capture the dynamic eventId from the URL
    this.route.paramMap.subscribe(params => {
      this.eventId = Number(params.get('eventId'));  // Get the eventId from the URL
      if (this.eventId) {
        this.loadInspirations();  // Load inspirations only after eventId is available
      }
    });
  }

  // Load inspirations for the specific section and event
  loadInspirations(): void {
    if (this.eventId) {
      this.eventDesignService.getEventInspirations(this.eventId, this.section).subscribe(response => {
        if (response.success) {
          // Prepend the correct backend URL to each inspiration's filename
          this.inspirations = response.inspirations.map((inspiration: { filename: string; }) => ({
            ...inspiration,
            filename: this.backendUrl + inspiration.filename // Ensure URL points to Flask server
          }));
          this.fillRemainingCards();
        }
      });
    }
  }

  // Ensure there are always 5 cards (filled with images or empty)
  fillRemainingCards(): void {
    const emptySlots = this.totalCards - this.inspirations.length;
    this.displayedInspirations = [...this.inspirations, ...Array(emptySlots).fill({})];
  }

  // Handle file selection
  onFileSelected(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      this.uploadInspiration(file, index);
    }
  }

  // Upload the selected inspiration file
  uploadInspiration(file: File, index: number): void {
    if (this.eventId) {
      this.eventDesignService.uploadInspiration(this.eventId, this.section, file).subscribe(response => {
        if (response.success && response.inspirations.length > 0) {
          const newImage = this.backendUrl + response.inspirations[0].filename; // Prepend the correct backend URL
          this.displayedInspirations[index] = {
            filename: newImage,
            id: response.inspirations[0].id  // Use the returned inspiration ID
          };
        }
      }, error => {
        console.error('Error uploading inspiration:', error);
      });
    }
  }

  // Remove an inspiration image
  removeInspiration(index: number, inspirationId: number): void {
    if (confirm('Are you sure you want to remove this inspiration?')) {
      this.eventDesignService.removeInspiration(inspirationId).subscribe(
        (response) => {
          if (response.success) {
            // Remove the inspiration from the frontend list
            this.displayedInspirations[index] = {};  // Replace with empty object (plus button)
            console.log('Inspiration removed successfully');
          } else {
            console.error('Failed to remove inspiration');
          }
        },
        (error) => {
          console.error('Error removing inspiration:', error);
        }
      );
    }
  }

  // Open file input to select an image
  triggerFileInput(index: number): void {
    const input = document.getElementById(`${this.section}_input_inspiration_${index}`);
    if (input) {
      input.click();
    }
  }
}
