import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { promoCode } from '../models/object-model';
import { LocalApiService } from './local-api.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PromoCodeService {
private promo_Url = `${environment.localBaseUrl}/promoCodes`;

  constructor(private _LocalApiService:LocalApiService) { }

  getAllPromoCodes(): Observable<promoCode[]> {
    return this._LocalApiService.get(this.promo_Url);
  }

  getPromoCodesBySeller(sellerId: string): Observable<promoCode[]> {
    return this._LocalApiService.get(`${this.promo_Url}?sellerId=${sellerId}`);
  }

  getPromoCodeByCode(code: string): Observable<promoCode[]> {
    return this._LocalApiService.get(`${this.promo_Url}?code=${code}`);
  }

  createPromoCode(promoCode: promoCode): Observable<promoCode> {
    return this._LocalApiService.post(this.promo_Url, promoCode);
  }

  updatePromoCode(id: string, promoCode: promoCode): Observable<promoCode> {
    return this._LocalApiService.put(`${this.promo_Url}/${id}`, promoCode);
  }

  deletePromoCode(id: string): Observable<void> {
    return this._LocalApiService.delete(`${this.promo_Url}/${id}`);
  }

  validatePromoCode(code: string): Observable<{ valid: boolean, message?: string, promoCode?: promoCode }> {
    return new Observable(observer => {
      this.getPromoCodeByCode(code).subscribe({
        next: (codes) => {
          if (codes.length === 0) {
            observer.next({ valid: false, message: 'Promo code not found' });
          } else {
            const promo = codes[0];
            const now = new Date();
            const validFrom = new Date(promo.validFrom);
            const validUntil = new Date(promo.validUntil);
            
            if (!promo.isActive) {
              observer.next({ valid: false, message: 'Promo code is inactive' });
            } else if (now < validFrom) {
              observer.next({ valid: false, message: 'Promo code not yet valid' });
            } else if (now > validUntil) {
              observer.next({ valid: false, message: 'Promo code has expired' });
            } else if (promo.currentUses >= promo.maxUses) {
              observer.next({ valid: false, message: 'Promo code usage limit reached' });
            } else {
              observer.next({ valid: true, promoCode: promo });
            }
          }
          observer.complete();
        },
        error: (err) => {
          observer.next({ valid: false, message: 'Error validating promo code' });
          observer.complete();
        }
      });
    });
  }
}