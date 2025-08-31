import { Component } from '@angular/core';
import { WishlistService } from '../../services/wishlist.service';
import { Observable } from 'rxjs';
import { wishlist, product  } from '../../models/object-model';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss'],
  })
export class WishlistComponent {
 displayedColumns: string[] = ['index', 'image', 'name', 'price', 'actions', 'delete'];
  wishlistItems$: Observable<wishlist[]>;

  constructor(
    public WishlistService: WishlistService,
    public CartService: CartService,
    private router: Router
  ) {
    this.wishlistItems$ = this.WishlistService.wishlistItems$;
  }

  clearWishlist(): void {
    if (confirm('Are you sure you want to clear your entire wishlist?')) {
      this.WishlistService.clearWishlist();
    }
  }

  removeItem(itemId: string | number): void {
    this.WishlistService.removeFromWishlist(itemId).subscribe();
  }

  addToCart(product: product): void {
    this.CartService.addToCart(product);
    console.log('Added to cart:', product);
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }
}