import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CsvImportExportService {
  private apiUrl = 'https://chasin619.pythonanywhere.com/api';  // Make sure this matches your Flask backend

  constructor(private http: HttpClient) {}

  // Export CSV for a given model
  exportCSV(model: string): Observable<Blob> {
    const url = `${this.apiUrl}/export_csv`;  // Ensure this matches your Flask route
    return this.http.post(url, { model_name: model }, { responseType: 'blob' });
  }

  // Import CSV for a given model
  importCSV(model: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('model_name', model);

    const url = `${this.apiUrl}/import_csv`;  // Ensure this matches your Flask route
    return this.http.post(url, formData);
  }
}
