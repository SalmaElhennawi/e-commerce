import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/products.service';
import { product } from '../../models/object-model';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product: product | null = null;
  isLoading = true;
  error: string | null = null;
  wishlistItems: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private cartService: CartService,
    private productService: ProductService,
    private router: Router,
    private wishlistService: WishlistService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProductDetails(productId);
      this.loadWishlistItems();
    } else {
      this.handleInvalidId();
    }
  }

  loadWishlistItems(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.id) {
      this.wishlistService.getWishlist().subscribe(items => {
        this.wishlistItems = items;
      });
    }
  }

  isProductInWishlist(productId: string | number): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return this.wishlistItems.some(item => item.product?.id == productId && item.userId == user.id);
  }

  toggleWishlist(product: product): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.id) {
      this.router.navigate(['/auth/user-login']);
      return;
    }

    if (this.isProductInWishlist(product.id)) {
      const wishlistItem = this.wishlistItems.find(item => item.product?.id == product.id && item.userId == user.id);
      if (wishlistItem) {
        this.wishlistService.removeFromWishlist(wishlistItem.id).subscribe({
          next: () => {
            this.loadWishlistItems();
          },
          error: (err) => console.error('Error removing from wishlist:', err)
        });
      }
    } else {
      this.wishlistService.addToWishlist(product).subscribe({
        next: () => {
          this.loadWishlistItems();
        },
        error: (err) => console.error('Error adding to wishlist:', err)
      });
    }
  }

  loadProductDetails(id: string | number): void {
    this.isLoading = true;
    this.error = null;
    
    this.productService.getProductById(id).pipe(
      catchError(err => {
        this.error = 'Failed to load product details';
        this.isLoading = false;
        return of(null);
      })
    ).subscribe({
      next: (product) => {
        this.product = product;
        this.isLoading = false;
        if (!product) {
          this.error = 'Product not found';
        }
      }
    });
  }

  private handleInvalidId(): void {
    this.isLoading = false;
    this.error = 'Invalid product ID';
  }

  addToCart(product: product): void {
    this.cartService.addToCart(product);
    this.router.navigate(['/cart']);
  }
}