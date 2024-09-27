import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private apiUrl = 'https://chasin619.pythonanywhere.com/api';  // Update with your Flask API URL

  constructor(private http: HttpClient) {}

  // Fetch labor cost for the current user
  getLaborCost(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/get_labor_cost?user_id=${userId}`);
  }

  // Update labor cost
  updateLaborCost(laborCostData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/update_labor_cost`, laborCostData);
  }

  // Fetch breakdown prices for a user
  getBreakDownPrices(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/break_down_price?user_id=${userId}`);
  }

  // Create a new breakdown price
  createBreakDownPrice(priceData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/break_down_price`, priceData);
  }

  // Set default breakdown price
  setDefaultBreakDownPrice(priceId: number, userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/set_default_break_down_price/${priceId}`, { user_id: userId });
  }

  // Delete a breakdown price
  deleteBreakDownPrice(priceId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete_break_down_price/${priceId}`);
  }



  // Fetch transfer prices
  getTransferPrices(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/transfer_price?user_id=${userId}`);
  }

  // Create a new transfer price
  createTransferPrice(priceData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/transfer_price`, priceData);
  }

  // Set a transfer price as default
  setDefaultTransferPrice(priceId: number, userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/set_default_transfer_price/${priceId}`, { user_id: userId });
  }

  // Delete a transfer price
  deleteTransferPrice(priceId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete_transfer_price/${priceId}`);
  }

  // Fetch all delivery prices
  getDeliveryPrices(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/get_delivery_prices?user_id=${userId}`);
  }
  

  // Create a new delivery price
  createDeliveryPrice(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create_delivery_price`, data);
  }
  

  // Set default delivery price
  setDefaultDeliveryPrice(priceId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/set_default_delivery_price/${priceId}`, {});
  }

  // Delete a delivery price
  deleteDeliveryPrice(priceId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete_delivery_price/${priceId}`);
  }

    // Fetch all contracts
    getContracts(userId: number): Observable<any> {
      return this.http.get(`${this.apiUrl}/get_contracts?user_id=${userId}`);
    }
  
    // Save or update contract
    saveContract(contractData: any): Observable<any> {
      return this.http.post(`${this.apiUrl}/contract`, contractData);  // Update the URL here
    }


    // Delete a contract
    deleteContract(contractId: number): Observable<any> {
      return this.http.delete(`${this.apiUrl}/delete_contract/${contractId}`);
    }
  


    // Fetch all letters
    getLetters(userId: number): Observable<any> {
      return this.http.get(`${this.apiUrl}/get_letters?user_id=${userId}`);
    }

    // Create or update a letter
    saveLetter(letterData: any): Observable<any> {
      return this.http.post(`${this.apiUrl}/save_letter`, letterData);
    }
  
    // Delete a letter
    deleteLetter(letterId: number): Observable<any> {
      return this.http.delete(`${this.apiUrl}/delete_letter/${letterId}`);
    }

  // Create a new ArrangementType
  createArrangementType(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/arrangement_type`, data);
  }

}
