import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ProductService } from '../../services/products.service';
import { product } from '../../models/object-model';
import { CartService } from '../../services/cart.service';
import { ActivatedRoute, Router } from '@angular/router';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  allProducts: product[] = [];
  isLoading: boolean = true;
  currentSlide: number = 0;
  wishlistItems: any[] = [];
  @ViewChild('cardsContainer') cardsContainer!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,
    private wishlistService: WishlistService
  ) {}

  ngOnInit(): void {
    this.loadAllProducts();
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

  loadAllProducts(): void {
    this.isLoading = true;
    this.productService.allProduct().subscribe({
      next: (data: product[]) => {
        this.allProducts = data.filter(product => 
          product.category?.toLowerCase() === 'men' ||
          product.category?.toLowerCase() === 'women' ||
          product.category?.toLowerCase() === 'children'
        ).slice(-8); // Get last 8 products
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.isLoading = false;
      }
    });
  }

  scrollCards(direction: number): void {
    const container = this.cardsContainer.nativeElement;
    const cardCount = this.allProducts.length;
    const visibleCards = this.getVisibleCardCount();
    
    this.currentSlide = Math.max(
      0, 
      Math.min(
        this.currentSlide + direction, 
        cardCount - visibleCards
      )
    );

    const cardWidth = container.children[0]?.offsetWidth || 300;
    const gapWidth = 24; 
    const scrollAmount = (cardWidth + gapWidth) * direction;
    
    container.style.transform = `translateX(-${this.currentSlide * (cardWidth + gapWidth)}px)`;
  }

  getVisibleCardCount(): number {
    if (window.innerWidth >= 992) return 4;
    if (window.innerWidth >= 768) return 2;
    return 1;
  }

  viewProductDetails(productId: string | number): void {
    this.router.navigate(['/product-details', productId]);
  }
  
  addToCart(product: product): void {
    this.cartService.addToCart(product);
    console.log('Added to cart:', product);
  }
}