import { Component, OnInit } from '@angular/core';
import { product } from '../../models/object-model';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/products.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit {
  searchResult: product[] = [];
  isLoading: boolean = true;
  query: string = '';

  constructor(
    private activeRoute: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe(params => {
      this.query = params['query'];
      if (this.query) {
        this.performSearch(this.query);
      }
    });
  }

  performSearch(query: string): void {
    this.isLoading = true;
    this.productService.searchProduct(query).subscribe({
      next: (result) => {
        this.searchResult = result;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Search error:', error);
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