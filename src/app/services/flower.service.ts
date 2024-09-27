import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FlowerService {
  // private apiUrl = 'https://chasin619.pythonanywhere.com/api';
  private apiUrl =environment.baseUrl;


  constructor(private http: HttpClient) {}

  // Get flowers

  getFlowers(userId: number, page: number = 1, perPage: number = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}/flowers`, {
      params: { user_id: userId, page: page.toString(), per_page: perPage.toString() }
    });
  }

  // Add new flower
  addFlower(flowerData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/add_flower`, flowerData);
  }
    // updateFlower  flower
    updateFlower(currentFlowerId:any,flowerData: FormData): Observable<any> {
      return this.http.post(`${this.apiUrl}/edit_flower/${currentFlowerId}`, flowerData);
    }
      // Delete a flower
  deleteFlower(flowerId: number, userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete_flower/${flowerId}`, {
      params: { user_id: userId }
    });
  }
}
