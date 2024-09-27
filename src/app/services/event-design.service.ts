// src/app/services/event-design.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventDesignService {
  private baseUrl = 'https://chasin619.pythonanywhere.com/api';

  constructor(private http: HttpClient) {}

  // Get specific event wedding styles
  getEventWeddingStyles(eventId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/get_event_design_wedding_styles/${eventId}`);
  }

  // Get all wedding styles
  getWeddingStyles(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/get_wedding_styles`);
  }

  // Get specific event wedding colors
  getEventWeddingColors(eventId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/get_event_design_wedding_colors/${eventId}`);
  }

  // Get all wedding colors
  getWeddingColors(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/get_wedding_colors`);
  }

  // Get specific event budget
  getBudget(eventId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/get_budget/${eventId}`);
  }

  updateBudget(eventId: number, budget: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/update_budget`, { eventId, budget });
  }

  // Get personals (arrangements) for specific event
  getEventPersonals(eventId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/get_event_design_personals/${eventId}`);
  }


  // Inspirations for specific event and section
  getEventInspirations(eventId: number, section: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/get_event_design_inspirations/${eventId}/${section}`);
  }

  uploadInspiration(eventId: number, section: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('event_id', eventId.toString());
    formData.append('section', section);
    formData.append('files', file);  // Only single file uploads
  
    return this.http.post<any>(`${this.baseUrl}/upload_inspirations`, formData);
  }

// Method to remove an inspiration
  removeInspiration(inspirationId: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/remove_inspiration`, { inspiration_id: inspirationId });
  }

  // Get all arrangement types
  getArrangementTypes(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/get_arrangement_types`);
  }


// Add a new method to fetch arrangements by type
getArrangementsByType(arrangementTypeId: number): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/get_arrangements_by_type/${arrangementTypeId}`);
}


// Update wedding styles for the event design
updateEventDesignWeddingStyles(eventId: number, styleIds: number[]): Observable<any> {
  return this.http.post<any>(`${this.baseUrl}/update_event_design_wedding_styles`, {
    event_id: eventId,
    style_ids: styleIds
  });
}

// Update wedding colors for the event design
updateEventDesignWeddingColors(eventId: number, colorIds: number[]): Observable<any> {
  return this.http.post<any>(`${this.baseUrl}/update_event_design_wedding_colors`, {
    event_id: eventId,
    color_ids: colorIds
  });
}

// Update personal arrangement for a specific event
updatePersonalArrangement(eventId: number, personalId: number, arrangementId: number): Observable<any> {
  console.log("Sending update request with data: ", {
    event_id: eventId,
    personal_id: personalId,
    arrangement_id: arrangementId
  });
  
  return this.http.post<any>(`${this.baseUrl}/update_event_design_arrangement_personals`, {
    event_id: eventId,
    personal_id: personalId,
    arrangement_id: arrangementId
  });
}

removePersonal(eventId: number, cardId: number): Observable<any> {
  return this.http.post<any>(`${this.baseUrl}/remove_event_design_arrangement_personals`, 
    { event_id: eventId, card_id: cardId });

}


  // Get ceremony arrangements for specific event
  getEventCeremony(eventId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/get_event_design_ceremony/${eventId}`);
  }

// Add a new ceremony arrangement for a specific event
addCeremonyArrangement(eventId: number, arrangementId: number, cardId: number): Observable<any> {
  return this.http.post(`${this.baseUrl}/add_event_design_arrangement_ceremony`, {
    event_id: eventId,
    arrangement_id: arrangementId,
    card_id: cardId
  }).pipe(
    tap((response) => {
      console.log('API Response:', response); 
    })
  );
}

// Update ceremony arrangement for a specific event
updateCeremonyArrangement(eventId: number, ceremonyId: number, arrangementId: number): Observable<any> {
  return this.http.post<any>(`${this.baseUrl}/update_event_design_arrangement_ceremony`, {
    event_id: eventId,
    card_id: ceremonyId,  // Use 'card_id' for ceremony card
    arrangement_id: arrangementId
  });
}

// Remove ceremony arrangement for a specific event
removeCeremony(eventId: number, cardId: number): Observable<any> {
  return this.http.post<any>(`${this.baseUrl}/remove_event_design_arrangement_ceremony`, 
    { event_id: eventId, card_id: cardId });
}


addPersonalArrangement(eventId: number, arrangementId: number, cardId: number): Observable<any> {
  return this.http.post(`${this.baseUrl}/add_event_design_arrangement_personals`, {
    event_id: eventId,
    arrangement_id: arrangementId,
    card_id: cardId  // Pass the card ID to update the correct card
  }).pipe(
    tap((response) => {
      console.log('API Response:', response); // Log the response to check arrangementTypeId
    })
  );
}



// Get reception arrangements for specific event
getEventReception(eventId: number): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/get_event_design_reception/${eventId}`);
}

// Add reception arrangement for a specific event
addReceptionArrangement(eventId: number, arrangementId: number, cardId: number): Observable<any> {
  return this.http.post(`${this.baseUrl}/add_event_design_arrangement_reception`, {
    event_id: eventId,
    arrangement_id: arrangementId,
    card_id: cardId
  }).pipe(
    tap((response) => {
      console.log('API Response:', response);
    })
  );
}


// Update reception arrangement for a specific event
updateReceptionArrangement(eventId: number, receptionId: number, arrangementId: number): Observable<any> {
  return this.http.post<any>(`${this.baseUrl}/update_event_design_arrangement_reception`, {
    event_id: eventId,
    reception_id: receptionId,
    arrangement_id: arrangementId
  });
}

// Remove reception arrangement for a specific event
removeReception(eventId: number, cardId: number): Observable<any> {
  return this.http.post<any>(`${this.baseUrl}/remove_event_design_arrangement_reception`, 
    { event_id: eventId, card_id: cardId });
}


getArrangementById(arrangementId: number): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/get_arrangement_by_id/${arrangementId}`).pipe(
    tap(response => {
      console.log('Arrangement by ID Response:', response);
    })
  );
}

// Remove a wedding style for a specific event
removeWeddingStyle(eventId: number, weddingStyleId: number): Observable<any> {
  return this.http.post<any>(`${this.baseUrl}/remove_event_design_wedding_style`, {
    event_id: eventId,
    wedding_style_id: weddingStyleId
  });
}

// Method to remove a wedding color from a specific event design
removeWeddingColor(eventId: number, colorId: number): Observable<any> {
  return this.http.post<any>(`${this.baseUrl}/remove_event_design_wedding_color`, {
    event_id: eventId,
    color_id: colorId
  });
}


// Add an empty ArrangementPersonalsCard to the event
addEmptyPersonalsCard(eventId: number, cardTitle: string, arrangementTypeId: number): Observable<any> {
  return this.http.post(`${this.baseUrl}/add_empty_personals_card`, {
    event_id: eventId,
    card_title: cardTitle,
    arrangement_type_id: arrangementTypeId
  });
}

// Update the title of a personal card
updatePersonalCardTitle(cardId: number, newTitle: string): Observable<any> {
  return this.http.post(`${this.baseUrl}/update_personal_card_title`, {
    card_id: cardId,
    new_title: newTitle
  });
}


// Add an empty ArrangementCeremonyCard to the event
addEmptyCeremonyCard(eventId: number, cardTitle: string, arrangementTypeId: number): Observable<any> {
  return this.http.post(`${this.baseUrl}/add_empty_ceremony_card`, {
    event_id: eventId,
    card_title: cardTitle,
    arrangement_type_id: arrangementTypeId
  });
}

// Update the title of a ceremony card
updateCeremonyCardTitle(cardId: number, newTitle: string): Observable<any> {
  return this.http.post(`${this.baseUrl}/update_ceremony_card_title`, {
    card_id: cardId,
    new_title: newTitle
  });
}


// Add an empty ArrangementReceptionCard to the event
addEmptyReceptionCard(eventId: number, cardTitle: string, arrangementTypeId: number): Observable<any> {
  return this.http.post(`${this.baseUrl}/add_empty_reception_card`, {
    event_id: eventId,
    card_title: cardTitle,
    arrangement_type_id: arrangementTypeId
  });
}

// Update the title of a reception card
updateReceptionCardTitle(cardId: number, newTitle: string): Observable<any> {
  return this.http.post(`${this.baseUrl}/update_reception_card_title`, {
    card_id: cardId,
    new_title: newTitle
  });
}


// Remove a personals card for a specific event
removePersonalsCard(eventId: number, cardId: number): Observable<any> {
  return this.http.post<any>(`${this.baseUrl}/remove_personals_card`, {
    event_id: eventId,
    card_id: cardId
  });
}


// Remove a ceremony card for a specific event
removeCeremonyCard(eventId: number, cardId: number): Observable<any> {
  return this.http.post<any>(`${this.baseUrl}/remove_ceremony_card`, {
    event_id: eventId,
    card_id: cardId
  });
}

// Remove a reception card for a specific event
removeReceptionCard(eventId: number, cardId: number): Observable<any> {
  return this.http.post<any>(`${this.baseUrl}/remove_reception_card`, {
    event_id: eventId,
    card_id: cardId
  });
}


}
