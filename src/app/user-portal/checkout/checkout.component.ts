import { Component, Inject } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { cart, order } from '../../models/object-model';
import { OrderService } from '../../services/order.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent {
    displayedColumns: string[] = ['index', 'image', 'name', 'price', 'quantity', 'total', 'actions'];
    cartItems$: Observable<cart[]>;
    subtotal$: Observable<number>;
    total$: Observable<number>;
    estimatedTax = 14;
    shipping = 10;
    discountAmount = 0;
    checkoutData = {
      email: '',
      address: '',
      contact: '',
      paymentMethod: 'Credit Card'
    };
  
    constructor(
      public cartService: CartService,
      private snackBar: MatSnackBar,
      private orderService: OrderService,
      private router: Router,
      public dialogRef: MatDialogRef<CheckoutComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this.cartItems$ = this.cartService.cartItems$;
      
      this.subtotal$ = this.cartItems$.pipe(
        map(items => items.reduce((total, item) => 
          total + (item.product.price * item.quantity), 0)
      ));
      
      this.total$ = this.cartService.total$;

      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.id) {
        this.checkoutData.email = user.email || '';
        this.checkoutData.contact = user.phone || '';
      }
    }

    submitOrder(): void {
      if (!this.validateCheckoutForm()) {
        return;
      }

      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const cartItems = this.cartService.cartItemsSubject.value;
      const total = this.cartService.getCalculatedTotal().total;

      const orderData: order = {
        email: this.checkoutData.email,
        address: this.checkoutData.address,
        contact: this.checkoutData.contact,
        totalPrice: total,
        userId: user.id,
        items: [...cartItems],
        paymentMethod: this.checkoutData.paymentMethod,
        orderDate: new Date().toISOString(),
        status: 'Processing'
      };

      this.orderService.createOrder(orderData).subscribe({
        next: () => {
          this.snackBar.open('Order placed successfully!', 'Close', { duration: 3000 });
          this.dialogRef.close(true);  // Close with success result
          this.cartService.clearCart(); // Clear cart on success
          this.router.navigate(['/products']);
        },
        error: (err) => {
          this.snackBar.open('Error placing order. Please try again.', 'Close', { duration: 3000 });
          console.error('Error creating order:', err);
        }
      });
    }

    private validateCheckoutForm(): boolean {
      if (!this.checkoutData.email || !this.checkoutData.email.includes('@')) {
        this.snackBar.open('Please enter a valid email address', 'Close', { duration: 3000 });
        return false;
      }

      if (!this.checkoutData.address) {
        this.snackBar.open('Please enter your shipping address', 'Close', { duration: 3000 });
        return false;
      }

      if (!this.checkoutData.contact || !/^[0-9]{10,15}$/.test(this.checkoutData.contact)) {
        this.snackBar.open('Please enter a valid phone number', 'Close', { duration: 3000 });
        return false;
      }

      return true;
    }

    onCancel(): void {
      this.dialogRef.close(false); // Close with cancel result
    }
}