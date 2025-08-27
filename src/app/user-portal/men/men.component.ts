import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/products.service';
import { product } from '../../models/object-model';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-men',
  templateUrl: './men.component.html',
  styleUrls: ['./men.component.scss']
})
export class MenComponent implements OnInit {
  menProducts: product[] = [];
  isLoading: boolean = true;
  wishlistItems: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,
    private wishlistService: WishlistService
  ) {}

  ngOnInit(): void {
    this.loadMenProducts();
    this.loadWishlistItems();
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

  loadMenProducts(): void {
    this.isLoading = true;
    this.productService.allProduct().subscribe({
      next: (data: product[]) => {
        this.menProducts = data.filter(product => 
          product.category?.toLowerCase() === 'men'
        );
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.isLoading = false;
      }
    });
  }

  viewProductDetails(productId: string | number): void {
    this.router.navigate(['/product-details', productId]);
  }

  addToCart(product: product): void {
    this.cartService.addToCart(product);
    console.log('Added to cart:', product);
  }
}