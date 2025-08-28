import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderSummaryComponent {
  @Input() subtotal: number = 0;
  @Input() shipping: number = 0;
  @Input() estimatedTax: number = 0;
  @Input() discountAmount: number = 0;
  @Output() checkout = new EventEmitter<void>();

  constructor(public cartService: CartService) {}

  get total(): number {
    return this.cartService.getCalculatedTotal().total;
  }

  onCheckout(): void {
    this.checkout.emit();
  }
}