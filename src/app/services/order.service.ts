import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { order } from '../models/object-model';
import { LocalApiService } from './local-api.service';
import { CartService } from './cart.service';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private orderUrl = `${environment.localBaseUrl}/orders`;

  constructor(
    private localApiService: LocalApiService,
    private cartService: CartService
  ) {}

  getUserOrders(): Observable<order[]> {
    const stored = localStorage.getItem('user');
    if (!stored) {
      return of([]);
    }

    try {
      const user = JSON.parse(stored);
      const userId = String(user.id);
      
         return this.getOrdersByUser(userId);
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return of([]);
    }
  }

  getOrdersByUser(userId: string): Observable<order[]> {
    if (!userId) return of([]);
    
     const params = new HttpParams().set('userId', userId);
    return this.localApiService.get(this.orderUrl, params);
  }

  getOrders(): Observable<order[]> {
    return this.localApiService.get(this.orderUrl);
  }

 cancelOrder(orderId: number | string): Observable<any> {
    return this.localApiService.delete(`${this.orderUrl}/${orderId}`);
  }

  createOrder(orderData: order): Observable<order> {
    return this.localApiService.post(this.orderUrl, orderData);
  }

  getOrderById(id: string): Observable<order> {
    return this.localApiService.get(`${this.orderUrl}/${id}`);
  }

  getAllOrders(): Observable<order[]> {
    return this.localApiService.get(this.orderUrl);
  }

  updateOrderStatus(orderId: number | string, status: string): Observable<any> {
    return this.localApiService.patch(`${this.orderUrl}/${orderId}`, { status });
  }
}