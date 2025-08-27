import { Injectable } from '@angular/core';
import { LocalApiService } from './local-api.service';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { product } from '../models/object-model';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
 private product_url = `${environment.localBaseUrl}/products/`;

  constructor( private _LocalApiService:LocalApiService) { }

  allProduct(sellerId?: string): Observable<any> {
  let params = new HttpParams();
  if (sellerId) {
    params = params.set('sellerId', sellerId);
  }
  return this._LocalApiService.get(this.product_url, params);
}
  addNewProduct(product_dto:any):Observable<any>{
    return this._LocalApiService.post(this.product_url, product_dto);
  }
  singleProduct(id: any, sellerId?: string): Observable<product> {
  return this._LocalApiService.get(this.product_url + id).pipe(
    map((product: product) => {
      if (sellerId && product.sellerId !== sellerId) {
        throw new Error('Product not found');
      }
      return product;
    })
  );
}
  updateProduct(id:any, product_dto:any):Observable<any>{
    return this._LocalApiService.put(this.product_url+id, product_dto);
  }
  deleteProduct(id:any):Observable<any>{
    return this._LocalApiService.delete(this.product_url+id);
  }
  getProductById(id: any): Observable<product> {
    return this.singleProduct(id);
  }

searchProduct(query: string): Observable<product[]> {
  return this._LocalApiService.get(`${this.product_url}?q=${encodeURIComponent(query)}`).pipe(
    map((products: product[]) => {
       const searchTerms = query.toLowerCase().split(' ');
      return products.filter(product => {
        const productText = (
          product.name.toLowerCase() + ' ' +
          product.category?.toLowerCase()
        );
        return searchTerms.some(term => productText.includes(term));
      });
    })
  );
}

}
