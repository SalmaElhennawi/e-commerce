import { Component, OnInit, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { SellerService } from '../../services/seller.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input() isOpen = false; // Add input for sidebar state
  isAuthDropdownOpen = false;
  isSellerLoggedIn = false;
  isMobileView = false;
  
  @Output() sidebarToggled = new EventEmitter<boolean>();
  
  constructor(
    private _Router: Router,
    private sellerService: SellerService
  ) {}
  
  ngOnInit(): void {
    this.checkViewport();
    this.isSellerLoggedIn = !!localStorage.getItem('seller');
    this.sellerService.isSellerLoggedIn.subscribe((isLoggedIn) => {
      this.isSellerLoggedIn = isLoggedIn;
    });
  }
  
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkViewport();
  }
  
  checkViewport() {
    this.isMobileView = window.innerWidth <= 768;
  }
  
  toggleSidebar() {
    this.sidebarToggled.emit(!this.isOpen);
  }
  
  closeMobileMenu() {
    this.sidebarToggled.emit(false);
  }
  
  logout(): void {
    this.sellerService.signOut();
    this.closeMobileMenu();
  }
}