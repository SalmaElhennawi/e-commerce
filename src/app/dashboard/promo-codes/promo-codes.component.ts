import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PromoCodeService } from '../../services/promo-code.service';
import { promoCode } from '../../models/object-model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-promo-codes',
  templateUrl: './promo-codes.component.html',
  styleUrls: ['./promo-codes.component.scss']
})
export class PromoCodesComponent implements OnInit {
  all_promo_data: promoCode[] = [];
  addEditPromoDForm: FormGroup;
  popup_header: string = '';
  isAddMode: boolean = true;
  edit_promo_id: string | null = null;
  isLoading: boolean = false;
  currentSellerId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private promoCodeService: PromoCodeService,
    private snackBar: MatSnackBar
  ) {
    this.addEditPromoDForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]+$/)]],
      discountPercentage: ['', [Validators.required, Validators.min(1), Validators.max(100)]],
      validFrom: ['', Validators.required],
      validUntil: ['', Validators.required],
      maxUses: ['', [Validators.required, Validators.min(1)]],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    this.loadSellerId();
    this.loadPromoCodes();
  }

  loadSellerId(): void {
    const sellerData = localStorage.getItem('seller');
    if (sellerData) {
      const seller = JSON.parse(sellerData);
      this.currentSellerId = seller.id;
    }
  }

  get f() {
    return this.addEditPromoDForm.controls;
  }

  loadPromoCodes(): void {
    this.isLoading = true;
    this.promoCodeService.getPromoCodesBySeller(this.currentSellerId!).subscribe({
      next: (data: promoCode[]) => {
        this.all_promo_data = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading promo codes:', error);
        this.isLoading = false;
        this.snackBar.open('Failed to load promo codes', 'Close', { duration: 3000 });
      }
    });
  }

  openPromoModal(isAdd: boolean, id?: string): void {
    this.isAddMode = isAdd;
    this.popup_header = isAdd ? 'Add New Promo Code' : 'Edit Promo Code';
    this.addEditPromoDForm.reset();

    if (!isAdd && id) {
      this.edit_promo_id = id;
      this.promoCodeService.getPromoCodeByCode(id).subscribe({
        next: (promos: promoCode[]) => {
          if (promos.length > 0) {
            const promo = promos[0];
            this.addEditPromoDForm.patchValue({
              code: promo.code,
              discountPercentage: promo.discountPercentage,
              validFrom: new Date(promo.validFrom).toISOString().substring(0, 10),
              validUntil: new Date(promo.validUntil).toISOString().substring(0, 10),
              maxUses: promo.maxUses,
              isActive: promo.isActive
            });
          }
        },
        error: (error) => {
          console.error('Error loading promo code:', error);
          this.snackBar.open('Failed to load promo code', 'Close', { duration: 3000 });
        }
      });

      
    }
  }

  submitPromo(): void {
    if (this.addEditPromoDForm.invalid) return;

    const promoData: promoCode = {
      ...this.addEditPromoDForm.value,
      sellerId: this.currentSellerId,
      currentUses: 0,
      validFrom: new Date(this.addEditPromoDForm.value.validFrom),
      validUntil: new Date(this.addEditPromoDForm.value.validUntil),
      ...(!this.isAddMode && { id: this.edit_promo_id })
    };

    const operation = this.isAddMode 
      ? this.promoCodeService.createPromoCode(promoData)
      : this.promoCodeService.updatePromoCode(this.edit_promo_id!, promoData);

    operation.subscribe({
      next: () => {
        this.loadPromoCodes();
        document.getElementById('closeModalButton')?.click();
        this.snackBar.open(`Promo code ${this.isAddMode ? 'added' : 'updated'} successfully`, 'Close', { duration: 3000 });
      },
      error: (error) => {
        console.error('Operation failed:', error);
        this.snackBar.open(`Failed to ${this.isAddMode ? 'add' : 'update'} promo code`, 'Close', { duration: 3000 });
      }
    });
  }

  deletePromo(id: string): void {
    if (confirm(`Are you sure you want to delete this promo code?`)) {
      this.promoCodeService.deletePromoCode(id).subscribe({
        next: () => {
          this.loadPromoCodes();
          this.snackBar.open('Promo code deleted successfully', 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.error('Delete failed:', error);
          this.snackBar.open('Failed to delete promo code', 'Close', { duration: 3000 });
        }
      });
    }
  }
}