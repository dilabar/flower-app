import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SaveEventDesignAsTemplateService {
  private saveTemplateUrl = 'https://chasin619.pythonanywhere.com/api/event_design/save_template'; // Adjust the API URL if necessary

  constructor(private http: HttpClient) {}

  saveTemplate(eventId: number, templateName: string): Observable<any> {
    return this.http.post<any>(this.saveTemplateUrl, {
      eventId,
      templateName
    });
  }
}
