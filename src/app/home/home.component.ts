import { Component, OnInit } from '@angular/core';
import { HomeService } from '../services/home.service'; // Correct path to the service
import { CalendarOptions } from '@fullcalendar/core'; // Correct import for CalendarOptions
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'; // Import CUSTOM_ELEMENTS_SCHEMA
import { FullCalendarModule } from '@fullcalendar/angular'; // Import FullCalendarModule

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [FullCalendarModule], // Properly import FullCalendarModule
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Use CUSTOM_ELEMENTS_SCHEMA
})
export class HomeComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin], // Register FullCalendar plugins here
    initialView: 'dayGridMonth',
    events: [],  // This will be dynamically loaded
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    buttonText: {
      today: 'today',
      month: 'month',
      week: 'week',
      day: 'day'
    },
    eventClick: function(info: any) {  // Explicitly type 'info' as 'any'
      window.open(info.event.url, '_blank');
      info.jsEvent.preventDefault();
    }
  };

  constructor(private homeService: HomeService) { }

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.homeService.getEvents().subscribe(events => {
      console.log(events); // Log events to ensure data is received
      this.calendarOptions.events = events;  // Set events dynamically
    });
  }
}
