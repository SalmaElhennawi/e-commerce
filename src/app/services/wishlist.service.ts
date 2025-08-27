import { Injectable } from '@angular/core';
import { LocalApiService } from './local-api.service';
import { environment } from '../../environments/environment';
import { wishlist, product } from '../models/object-model';
import { BehaviorSubject, forkJoin, Observable, of, tap, throwError } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistUrl = `${environment.localBaseUrl}/wishlist`;
  private wishlistItemsSubject = new BehaviorSubject<wishlist[]>([]);
  wishlistItems$ = this.wishlistItemsSubject.asObservable();

  constructor(private localApiService: LocalApiService) { 
    this.loadWishlistItems();
  }

  private loadWishlistItems(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.id) {
      this.wishlistItemsSubject.next([]);
      return;
    }

    this.localApiService.get(
      this.wishlistUrl,
      new HttpParams().set('userId', user.id)
    ).subscribe({
      next: (items: wishlist[]) => {
        this.wishlistItemsSubject.next(items || []);
      },
      error: (err) => {
        console.error('Error loading wishlist items:', err);
        this.wishlistItemsSubject.next([]);
      }
    });
  }

  getWishlist(): Observable<wishlist[]> {
    return this.wishlistItems$;
  }

  addToWishlist(product: product): Observable<wishlist> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.id) {
      return throwError(() => new Error('User not logged in'));
    }

    const currentItems = this.wishlistItemsSubject.value;
    const existingItem = currentItems.find(item => 
      item.product.id === product.id && item.userId === user.id
    );

    if (existingItem) {
      return of(existingItem);
    }

    const newItem: wishlist = {
      id: 'temp_' + Date.now(),
      product,
      userId: user.id
    };

    return this.localApiService.post(this.wishlistUrl, newItem).pipe(
      tap(addedItem => {
        this.wishlistItemsSubject.next([...currentItems, addedItem]);
      })
    );
  }

  removeFromWishlist(itemId: number | string): Observable<any> {
    const currentItems = this.wishlistItemsSubject.value;
    return this.localApiService.delete(`${this.wishlistUrl}/${itemId}`).pipe(
      tap(() => {
        const updatedItems = currentItems.filter(item => item.id !== itemId);
        this.wishlistItemsSubject.next(updatedItems);
      })
    );
  }

 clearWishlist(): void {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const currentItems = this.wishlistItemsSubject.value.filter(item => item.userId === user.id);
  
  const deleteRequests = currentItems.map(item => 
    this.localApiService.delete(`${this.wishlistUrl}/${item.id}`)
  );

  if (deleteRequests.length === 0) {
    return;
  }

  forkJoin(deleteRequests).subscribe({
    next: () => {
      this.wishlistItemsSubject.next([]);
    },
    error: (err) => {
      console.error('Error clearing wishlist:', err);
    }
  });
  }
}