import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { UserService } from '../../services/user.service';
import { WishlistService } from '../../services/wishlist.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isMobileMenuOpen = false;
  isAuthDropdownOpen = false;
  isSearchBarOpen = false;
  isCartOpen = false;
  isWishlistOpen = false;
  searchTerm: string = '';
  cartItemCount = 0;
  wishlistItemCount = 0;
  isUserLoggedIn = false;
  currentLang = 'en';

  constructor(
    private _Router: Router,
    private _UserService: UserService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private languageService: LanguageService
  ) { }

  toggleLanguage() {
    const newLang = this.currentLang === 'en' ? 'ar' : 'en';
    this.languageService.switchLanguage(newLang);
    this.currentLang = newLang;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isMobileMenuOpen) {
      this.isAuthDropdownOpen = false;
      this.isSearchBarOpen = false;
    }
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  toggleAuthDropdown() {
    this.isAuthDropdownOpen = !this.isAuthDropdownOpen;
    if (this.isAuthDropdownOpen) {
      this.isSearchBarOpen = false;
      this.isMobileMenuOpen = false;
    }
  }

  closeAuthDropdown() {
    this.isAuthDropdownOpen = false;
  }

  ngOnInit(): void {
    this.isUserLoggedIn = !!localStorage.getItem('user');
    this._UserService.isUserLoggedIn.subscribe((isLoggedIn) => {
      this.isUserLoggedIn = isLoggedIn;
    });

    this.cartService.cartItems$.subscribe(items => {
      this.cartItemCount = items.reduce((total, item) => total + item.quantity, 0);
    });

    this.wishlistService.wishlistItems$.subscribe(items => {
      this.wishlistItemCount = items.length;
    });
    
    this.currentLang = this.languageService.getCurrentLang();
  }

  logout(): void {
    this._UserService.signOut();
    this.closeAuthDropdown();
    this.closeMobileMenu();
  }

  goToProfile() {
    this.closeMobileMenu();
    this._Router.navigate(['/profile']);  
  }

  navigateToCart() {
    this.closeMobileMenu();
    this._Router.navigate(['/cart']);
  }

  navigateToWishlist() {
    this.closeMobileMenu();
    this._Router.navigate(['/wishlist']);
  }

  toggleSearchBar() {
    this.isSearchBarOpen = !this.isSearchBarOpen;
    if (this.isSearchBarOpen) {
      this.isAuthDropdownOpen = false;
      this.isMobileMenuOpen = false;
    }
  }

  search() {
    if (this.searchTerm.trim()) {
      this._Router.navigate(['/search', this.searchTerm.trim()]);
      this.isSearchBarOpen = false;
      this.searchTerm = '';
    }
  }
  
  toggleCart() {
    this.isCartOpen = !this.isCartOpen;
    if (this.isCartOpen) {
      this.isMobileMenuOpen = false;
      this.isAuthDropdownOpen = false;
      this.isSearchBarOpen = false;
    }
  }

  addToCart() {
    this.cartItemCount++;
  }

  removeFromCart() {
    if (this.cartItemCount > 0) {
      this.cartItemCount--;
    }
  }

  closeCart(): void {
    this.isCartOpen = false;
  }

  togglewishlist() {
    this.isWishlistOpen = !this.isWishlistOpen;
    if (this.isWishlistOpen) {
      this.isMobileMenuOpen = false;
      this.isAuthDropdownOpen = false;
      this.isSearchBarOpen = false;
    }
  }

  addToWishlist() {
    this.wishlistItemCount++;
  }

  removeFromWishlist() {
    if (this.wishlistItemCount > 0) {
      this.wishlistItemCount--;
    }
  }

  closeWishlist(): void {
    this.isWishlistOpen = false;
  }
}