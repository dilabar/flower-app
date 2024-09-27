// src/app/events/events.component.ts
import { Component, OnInit } from '@angular/core';
import { EventsService } from '../services/events.service';
import { RouterModule } from '@angular/router'; // Import RouterModule
import { CommonModule } from '@angular/common'; // Import CommonModule
import { FormsModule } from '@angular/forms'; // Import FormsModule

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
  imports: [RouterModule, CommonModule, FormsModule], // Add imports here
  standalone: true, // Ensure this is marked as a standalone component
})
export class EventsComponent implements OnInit {
  events: any[] = [];
  filters: any = {
    name: '',
    email: '',
    wedding_day: '',
    sort_created_day: '',
    sort_wedding_day: ''
  };

  constructor(private eventsService: EventsService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventsService.getEvents(this.filters).subscribe(
      (data) => {
        if (data.success) {
          this.events = data.events;
        } else {
          console.error('Failed to fetch events:', data.message);
        }
      },
      (error) => {
        console.error('Error fetching events:', error);
      }
    );
  }

  searchEvents(): void {
    this.loadEvents();
  }
}
