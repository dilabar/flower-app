import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ArrangementsService {
  private baseUrl = environment.baseUrl;


  constructor(private http: HttpClient) { }

  getArrangements(userId: number, page: number = 1, perPage: number = 10): Observable<any> {
    return this.http.get(`${this.baseUrl}/arrangements`, {
      params: { user_id: userId, page: page.toString(), per_page: perPage.toString() }
    });
  }

  getArrangement(arrangementId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/arrangement/${arrangementId}`);
  }

  updateArrangement(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/update_arrangement`, data);
  }

  addArrangement(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/add_arrangement`, data);
  }

  getIngredientChoices(): Observable<any> {
    return this.http.get(`${this.baseUrl}/ingredient_choices`);
  }

  getTypeChoices(): Observable<any> {
    return this.http.get(`${this.baseUrl}/type_choices`);
  }

  getColorChoices(): Observable<any> {
    return this.http.get(`${this.baseUrl}/color_choices`);
  }

  getWeddingStyleChoices(): Observable<any> {
    return this.http.get(`${this.baseUrl}/wedding_style_choices`);
  }
  
  deleteArrangement(arngid: number, userId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete_arrangement/${arngid}`, {
      params: { user_id: userId }
    });
  }
}
