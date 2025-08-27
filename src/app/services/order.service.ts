import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
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
  ) { }

   getUserOrders(): Observable<order[]> {
    const userId = localStorage.getItem('user_id') || '';
    return this.getOrdersByUser(userId);
  }

  cancelOrder(orderId: number): Observable<any> {
    return this.localApiService.delete(`${this.orderUrl}/${orderId}`);
  }
  
  createOrder(orderData: order): Observable<order> {
    return this.localApiService.post(this.orderUrl, orderData);
  }

  getOrdersByUser(userId: string): Observable<order[]> {
    return this.localApiService.get(this.orderUrl, new HttpParams().set('userId', userId));
  }

  getOrderById(id: string): Observable<order> {
    return this.localApiService.get(`${this.orderUrl}/${id}`);
  }
}