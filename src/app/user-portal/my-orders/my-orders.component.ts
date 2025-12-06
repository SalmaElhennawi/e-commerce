import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { order } from '../../models/object-model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.scss'
})
export class MyOrdersComponent implements OnInit {

  orders: order[] = [];
  isLoading = false;
  hasOrders = false;
  selectedOrder: order | null = null;
  reordering = false;

  constructor(
    private orderService: OrderService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadUserOrders();
  }

  loadUserOrders(): void {
    this.isLoading = true;

    this.orderService.getUserOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.hasOrders = orders.length > 0;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading orders:', err);
        this.orders = [];
        this.hasOrders = false;
        this.isLoading = false;
      }
    });
  }

  // ---------------------------------
  // CANCEL
  // ---------------------------------
  cancelOrder(orderId: number | string | undefined): void {

    if (!orderId) {
      alert('Order ID missing');
      return;
    }

    if (!confirm('Cancel this order?')) return;

    this.orderService.cancelOrder(orderId).subscribe({
      next: () => {
        const order = this.orders.find(o => o.id == orderId);
        if (order) order.status = 'Cancelled';
        alert('Order cancelled');
      },
      error: () => alert('Error cancelling order')
    });
  }

  // ---------------------------------
  // UI HELPERS
  // ---------------------------------

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString('en-US');
  }

  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }

  getTotalItems(order: order): number {
    return order.items?.reduce((t, i) => t + i.quantity, 0) || 0;
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

  viewOrderDetails(order: order): void {
    this.selectedOrder = order;
  }

  closeOrderDetails(): void {
    this.selectedOrder = null;
  }

  getActiveOrdersCount(): number {
    return this.orders.filter(o =>
      o.status !== 'Cancelled' &&
      o.status !== 'Delivered'
    ).length;
  }

  // ---------------------------------
  // REORDER
  // ---------------------------------
  reorder(order: order): void {

    if (!order?.items?.length) {
      alert('Order has no items');
      return;
    }

    if (!confirm(`Reorder ${order.items.length} items?`)) return;

    this.reordering = true;

    order.items.forEach(item => {
      this.cartService.addToCart(item.product, item.quantity);
    });

    this.reordering = false;

    alert('Items successfully added to your cart!');
  }
}
