import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SellerService } from '../../services/seller.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  isAuthDropdownOpen = false;
  isMobileMenuOpen = false;
  isSellerLoggedIn = false;
  
  constructor(
    private _Router: Router,
    private sellerService: SellerService
  ) {}

  ngOnInit(): void {
    this.isSellerLoggedIn = !!localStorage.getItem('seller');
    this.sellerService.isSellerLoggedIn.subscribe((isLoggedIn) => {
      this.isSellerLoggedIn = isLoggedIn;
    });
  }
  

   toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isMobileMenuOpen) {
    }
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

   toggleAuthDropdown() {
    this.isAuthDropdownOpen = !this.isAuthDropdownOpen;
    if (this.isAuthDropdownOpen) {
      this.isMobileMenuOpen = false;
    }
  }

  closeAuthDropdown() {
    this.isAuthDropdownOpen = false;
  }


  logout(): void {
    this.sellerService.signOut();
    this.closeAuthDropdown();
    this.closeMobileMenu();
  }

}