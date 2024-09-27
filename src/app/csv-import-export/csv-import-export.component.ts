import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CsvImportExportService } from '../services/csv-import-export.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'; // Import HttpClient
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-csv-import-export',
  standalone: true,
  templateUrl: './csv-import-export.component.html',
  styleUrls: ['./csv-import-export.component.css'],
  imports: [CommonModule, FormsModule], // Import CommonModule and FormsModule
})
export class CsvImportExportComponent {
  models: string[] = [
    'arrangement', 'arrangement_type', 'colors', 'contract', 'letter',
    'event', 'wedding_info', 'cocktails', 'wedding_numbers', 'wedding_style', 
    'event_design', 'arrangement_personals_card', 'arrangement_ceremony_card', 
    'arrangement_reception_card', 'flower', 'invite', 'user', 'breakdown_price',
    'transfer_price', 'delivery_setup_price'
  ];  // Full list of models from your API

  selectedModel: string = '';
  selectedFile: File | null = null;

  constructor(
    private csvService: CsvImportExportService,
    private http: HttpClient // Inject HttpClient
  ) {}

  // Handle file selection
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  // Export CSV
  exportCSV() {
    if (this.selectedModel) {
      this.csvService.exportCSV(this.selectedModel).subscribe((blob) => {
        saveAs(blob, `${this.selectedModel}.csv`);
      });
    }
  }

  // Import CSV
  importCSV() {
    if (!this.selectedModel || !this.selectedFile) {
      alert('Please select a model and file before importing.');
      return;
    }

    const formData = new FormData();
    formData.append('model_name', this.selectedModel);
    formData.append('file', this.selectedFile); // Use selectedFile instead of csvFile

    this.http.post('https://chasin619.pythonanywhere.com/api/import_csv', formData).subscribe({
      next: (response: any) => {  // Optionally, you can define a type for the response
        console.log('Import successful', response);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error during CSV import', error);
        if (error.status === 500) {
          alert('Server error occurred. Please check the CSV data and try again.');
        } else if (error.status === 400) {
          alert('There is an issue with your CSV data. Please check and retry.');
        }
      }
    });
  }
}
