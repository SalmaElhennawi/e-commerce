import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, map, Observable } from 'rxjs';
import { cart, product } from '../models/object-model';
import { environment } from '../../environments/environment';
import { LocalApiService } from './local-api.service';
import { HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CartService {
 cartItemsSubject = new BehaviorSubject<cart[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();
  private cartUrl = `${environment.localBaseUrl}/carts`;
 shipping = 10;
  estimatedTax = 14;
 discountAmount = 0;

  constructor(
    private localApiService: LocalApiService, 
    private  router: Router
  ) {
    this.loadCartItems();
  }

  private loadCartItems(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.id) {
      this.cartItemsSubject.next([]);
      return;
    }

    this.localApiService.get(
      this.cartUrl,
      new HttpParams().set('userId', user.id)
    ).subscribe({
      next: (items: cart[]) => {
        this.cartItemsSubject.next(items || []);
      },
      error: (err) => {
        console.error('Error loading cart items:', err);
        this.cartItemsSubject.next([]);
      }
    });
  }

  addToCart(product: product, quantity: number = 1): void {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!user.id) {
    console.error('User not logged in or user ID not available');
    this.router.navigate(['/auth/user-login']);
    return;
  }

  const currentItems = this.cartItemsSubject.value;
  const existingItem = currentItems.find(item => 
    item.product.id === product.id && item.userId === user.id
  );
  
  if (existingItem) {
    this.updateQuantity(product.id, existingItem.quantity + quantity);
  } else {
    const newItem: cart = { 
      id: 'temp_' + Date.now(), 
      product, 
      quantity,
      userId: user.id
    };
    
    this.localApiService.post(this.cartUrl, newItem).subscribe({
      next: (addedItem) => {
        this.cartItemsSubject.next([...currentItems, addedItem]);
      },
      error: (err) => console.error('Error adding to cart:', err)
    });
  }
}

  removeFromCart(cartItemId: string | number): void {
    const currentItems = this.cartItemsSubject.value;
    this.localApiService.delete(`${this.cartUrl}/${cartItemId}`).subscribe({
      next: () => {
        const updatedItems = currentItems.filter(item => item.id !== cartItemId);
        this.cartItemsSubject.next(updatedItems);
      },
      error: (err) => console.error('Error removing from cart:', err)
    });
  }

  updateQuantity(productId: string | number, quantity: number): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const currentItems = this.cartItemsSubject.value;
    const itemToUpdate = currentItems.find(item => 
      item.product.id === productId && item.userId === user.id
    );
    
    if (itemToUpdate) {
      if (quantity <= 0) {
        this.removeFromCart(itemToUpdate.id); 
        return;
      }
      
      const updatedItem = { ...itemToUpdate, quantity };
      this.localApiService.put(`${this.cartUrl}/${itemToUpdate.id}`, updatedItem).subscribe({
        next: () => {
          const updatedItems = currentItems.map(item => 
            item.product.id === productId ? updatedItem : item
          );
          this.cartItemsSubject.next(updatedItems);
        },
        error: (err) => console.error('Error updating quantity:', err)
      });
    }
  }

  clearCart(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const currentItems = this.cartItemsSubject.value.filter(item => item.userId === user.id);
    
    const deleteRequests = currentItems.map(item => 
      this.localApiService.delete(`${this.cartUrl}/${item.id}`)
    );

    forkJoin(deleteRequests).subscribe({
      next: () => {
        this.cartItemsSubject.next([]);
      },
      error: (err) => console.error('Error clearing cart:', err)
    });
  }

   getSubtotal(): number {
    const items = this.cartItemsSubject.value;
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }

  get currentDiscount(): number {
    return this.discountAmount;
  }

getCalculatedTotal(): { subtotal: number, discount: number, total: number } {
  const subtotal = this.getSubtotal();
  const discount = this.discountAmount;
  const total = subtotal - discount + this.shipping + this.estimatedTax;
  
  return {
    subtotal: subtotal,
    discount: discount,
    total: total
  };
}

get total$(): Observable<number> {
  return this.cartItems$.pipe(
    map(() => this.getCalculatedTotal().total)
  );
}
}