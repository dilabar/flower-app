import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApplyEventDesignTemplateService {
  private fetchTemplatesUrl = 'https://chasin619.pythonanywhere.com/api/event_design/templates';
  private applyTemplateUrl = 'https://chasin619.pythonanywhere.com/api/event_design/apply_template';

  constructor(private http: HttpClient) {}

  fetchTemplates(): Observable<any> {
    return this.http.get<any>(this.fetchTemplatesUrl);
  }

  applyTemplate(eventId: number, templateId: number): Observable<any> {
    return this.http.post<any>(this.applyTemplateUrl, {
      eventId,
      templateId
    });
  }
}
