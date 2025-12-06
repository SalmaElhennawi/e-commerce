import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { order, cart } from '../../models/object-model';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: order[] = [];
  filteredOrders: order[] = [];
  selectedOrder: order | null = null;
  
  // Filter properties
  searchTerm: string = '';
  statusFilter: string = 'all';
  dateFilter: string = 'all';
  selectedUserId: string = '';
  
  // Status options
  statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'Processing', label: 'Processing' },
    { value: 'Shipped', label: 'Shipped' },
    { value: 'Delivered', label: 'Delivered' },
    { value: 'Cancelled', label: 'Cancelled' }
  ];
  
  // Date filter options
  dateOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'Last 7 Days' },
    { value: 'month', label: 'Last 30 Days' }
  ];
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  
  // Loading state
  isLoading: boolean = false;
  
  // User IDs for filtering
  userIds: string[] = [];
  uniqueUserIds: Set<string> = new Set();

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadAllOrders();
  }

  loadAllOrders(): void {
    this.isLoading = true;
    
    this.orderService.getAllOrders().subscribe({
      next: (allOrders) => {
        this.orders = allOrders;
        this.extractUserIds();
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading all orders:', error);
        this.extractUserIds();
        this.applyFilters();
        this.isLoading = false;
      }
    });
  }

  extractUserIds(): void {
    this.uniqueUserIds.clear();
    this.orders.forEach(order => {
      if (order.userId) {
        this.uniqueUserIds.add(order.userId.toString());
      }
    });
    this.userIds = Array.from(this.uniqueUserIds);
  }

  applyFilters(): void {
    let result = [...this.orders];
    
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(order => 
        order.id?.toString().toLowerCase().includes(term) ||
        order.email.toLowerCase().includes(term) ||
        order.address.toLowerCase().includes(term) ||
        order.contact.toLowerCase().includes(term)
      );
    }
    
    if (this.statusFilter !== 'all') {
      result = result.filter(order => order.status === this.statusFilter);
    }
    
    if (this.selectedUserId) {
      result = result.filter(order => order.userId.toString() === this.selectedUserId);
    }
    
    if (this.dateFilter !== 'all') {
      const now = new Date();
      result = result.filter(order => {
        if (!order.orderDate) return false;
        const orderDate = new Date(order.orderDate);
        
        switch (this.dateFilter) {
          case 'today':
            return orderDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return orderDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return orderDate >= monthAgo;
          default:
            return true;
        }
      });
    }
    
    this.filteredOrders = result;
    this.totalPages = Math.ceil(this.filteredOrders.length / this.itemsPerPage);
    this.currentPage = 1;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = 'all';
    this.dateFilter = 'all';
    this.selectedUserId = '';
    this.applyFilters();
  }

  viewOrderDetails(order: order): void {
    this.selectedOrder = order;
  }

  closeOrderDetails(): void {
    this.selectedOrder = null;
  }

  updateOrderStatus(orderId: string | number | undefined, newStatus: string): void {
    if (!orderId) return;
    
    this.orderService.updateOrderStatus(orderId, newStatus).subscribe({
      next: () => {
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
          order.status = newStatus;
          
          const filteredOrder = this.filteredOrders.find(o => o.id === orderId);
          if (filteredOrder) {
            filteredOrder.status = newStatus;
          }
        }
      },
      error: (error) => {
        console.error('Error updating order status:', error);
        alert('Failed to update order status');
      }
    });
  }

  // Add this property
cancellingOrderId: string | number | null = null;

// Update cancelOrder method
cancelOrder(orderId: string | number | undefined): void {
  if (!orderId) return;
  
  this.cancellingOrderId = orderId;
  
  if (confirm('Are you sure you want to cancel this order?')) {
    this.orderService.updateOrderStatus(orderId, 'Cancelled').subscribe({
      next: () => {
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
          order.status = 'Cancelled';
        }
        this.cancellingOrderId = null;
      },
      error: (error) => {
        console.error('Error cancelling order:', error);
        alert('Failed to cancel order');
        this.cancellingOrderId = null;
      }
    });
  } else {
    this.cancellingOrderId = null;
  }
}
  getPaginatedOrders(): order[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredOrders.slice(startIndex, startIndex + this.itemsPerPage);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  getStatusClass(status: string = ''): string {
    switch (status.toLowerCase()) {
      case 'processing': return 'status-processing';
      case 'shipped': return 'status-shipped';
      case 'delivered': return 'status-delivered';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-default';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatPrice(price: number): string {
    return `$ ${price.toFixed(2)}`;
  }

  getTotalItems(order: order): number {
    return order.items?.reduce((total, item) => total + item.quantity, 0) || 0;
  }

  mathMin(a: number, b: number): number {
    return Math.min(a, b);
  }
}