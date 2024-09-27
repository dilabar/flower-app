import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core'; // Necessary for importing other modules
import { FullCalendarModule } from '@fullcalendar/angular'; // Import FullCalendar module

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(), // Add HTTP Client support
    importProvidersFrom(FullCalendarModule) // Import FullCalendarModule
  ]
};
