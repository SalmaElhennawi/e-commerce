import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/data-model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  // For pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalUsers: number = 0;

  // For search
  searchTerm: string = '';

  // For selection
  selectedUsers: Set<string> = new Set();
  allSelected: boolean = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.totalUsers = users.length;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load users. Please try again.';
        this.isLoading = false;
        console.error('Error loading users:', error);
      }
    });
  }

  get filteredUsers(): User[] {
    if (!this.searchTerm) {
      return this.users;
    }
    
    const term = this.searchTerm.toLowerCase();
    return this.users.filter(user => 
      user.name.toLowerCase().includes(term) || 
      user.email.toLowerCase().includes(term) ||
      user.phone?.toLowerCase().includes(term)
    );
  }

  get paginatedUsers(): User[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredUsers.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
  }

  getVisiblePages(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    
    if (this.totalPages <= maxVisible) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (this.currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push(this.totalPages);
      } else if (this.currentPage >= this.totalPages - 2) {
        pages.push(1);
        for (let i = this.totalPages - 3; i <= this.totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push(this.currentPage - 1);
        pages.push(this.currentPage);
        pages.push(this.currentPage + 1);
        pages.push(this.totalPages);
      }
    }
    
    return pages;
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  onSearch(): void {
    this.currentPage = 1;
    this.clearSelection();
  }

  onItemsPerPageChange(): void {
    this.currentPage = 1;
    this.clearSelection();
  }

  // Selection methods
  toggleSelectAll(event: any): void {
    const isChecked = event.target.checked;
    this.allSelected = isChecked;
    
    if (isChecked) {
      this.paginatedUsers.forEach(user => this.selectedUsers.add(user.id));
    } else {
      this.clearSelection();
    }
  }

  toggleUserSelection(userId: string, event: any): void {
    if (event.target.checked) {
      this.selectedUsers.add(userId);
    } else {
      this.selectedUsers.delete(userId);
      this.allSelected = false;
    }
  }

  clearSelection(): void {
    this.selectedUsers.clear();
    this.allSelected = false;
  }

  // Action methods
  sendMessage(user: User): void {
    console.log('Send message to:', user);
    const message = prompt(`Enter message for ${user.name}:`);
    if (message) {
      alert(`Message sent to ${user.name}: "${message}"`);
    }
  }

  messageSelectedUsers(): void {
    if (this.selectedUsers.size > 0) {
      const message = prompt(`Enter message for ${this.selectedUsers.size} selected users:`);
      if (message) {
        alert(`Message sent to ${this.selectedUsers.size} users: "${message}"`);
      }
    }
  }

  // Stats methods
  getActiveUsersCount(): number {
    // This is a placeholder - implement your own logic
    return Math.floor(this.totalUsers * 0.7);
  }

  getNewUsersCount(): number {
    // This is a placeholder - implement your own logic
    return Math.floor(this.totalUsers * 0.15);
  }
}