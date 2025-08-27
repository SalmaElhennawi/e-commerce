import { Component, ViewChild } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { cart } from '../../models/object-model';
import { PromoCodeService } from '../../services/promo-code.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { CheckoutComponent } from '../checkout/checkout.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
  displayedColumns: string[] = ['index', 'image', 'name', 'price', 'quantity', 'total', 'actions'];
  cartItems$: Observable<cart[]>;
  subtotal$: Observable<number>;
  promoCodeInput = '';
  discountAmount = 0;
  appliedPromoCode: any = null;

  constructor(
    public cartService: CartService,
    private promoCodeService: PromoCodeService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.cartItems$ = this.cartService.cartItems$;
    
    this.subtotal$ = this.cartItems$.pipe(
      map(items => items.reduce((total, item) => 
        total + (item.product.price * item.quantity), 0)
    ));
  }

  removeItem(cartItemId: string | number): void {
    this.cartService.removeFromCart(cartItemId);
  }

  updateQuantity(item: cart, quantity: number): void {
    if (quantity > 0) {
      this.cartService.updateQuantity(item.product.id, quantity);
    } else {
      this.removeItem(item.id); 
    }
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear your entire cart?')) {
      this.cartService.clearCart();
    }
  }

  applyPromoCode(): void {
    if (!this.promoCodeInput) return;

    this.promoCodeService.validatePromoCode(this.promoCodeInput).subscribe({
      next: (result) => {
        if (result.valid && result.promoCode) {
          this.appliedPromoCode = result.promoCode;
          this.calculateDiscount();
          this.snackBar.open('Promo code applied successfully!', 'Close', { duration: 3000 });
        } else {
          this.snackBar.open(result.message || 'Invalid promo code', 'Close', { duration: 3000 });
        }
      },
      error: () => {
        this.snackBar.open('Error validating promo code', 'Close', { duration: 3000 });
      }
    });
  }

  calculateDiscount(): void {
    if (!this.appliedPromoCode) {
      this.discountAmount = 0;
      this.cartService.discountAmount = 0;
      return;
    }

    this.subtotal$.subscribe(subtotal => {
      this.discountAmount = subtotal * (this.appliedPromoCode.discountPercentage / 100);
      this.cartService.discountAmount = this.discountAmount;
    });
  }

  removePromoCode(): void {
    this.promoCodeInput = '';
    this.appliedPromoCode = null;
    this.discountAmount = 0;
    this.cartService.discountAmount = 0;
    this.snackBar.open('Promo code removed', 'Close', { duration: 3000 });
  }

  openCheckout(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.id) {
      return;
    }

    this.dialog.open(CheckoutComponent, {
      width: '800px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      disableClose: true,
      data: {
        cartItems: this.cartService.cartItemsSubject.value,
      }
    });
  }
}