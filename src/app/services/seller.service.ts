import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { Login, Register } from '../models/data-model';
import { LocalApiService } from './local-api.service';
import { environment } from '../../environments/environment';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SellerService {
  isSellerLoggedIn = new BehaviorSubject<boolean>(false);
  isLoginError = new EventEmitter<boolean>(false);

  constructor(
    private localApi: LocalApiService,
    private router: Router
  ) { }

  userSignUp(data: Register) {
    this.localApi.get(
      `${environment.localBaseUrl}/sellers`,
      new HttpParams().set('email', data.email)
    ).subscribe({
      next: (existingSellers) => {
        if (existingSellers && existingSellers.length > 0) {
          this.isLoginError.emit(true);
        } else {
          this.localApi.post(`${environment.localBaseUrl}/sellers`, data)
            .subscribe({
              next: (result) => {
                if (result) {
                  localStorage.setItem('seller', JSON.stringify(result));
                  this.router.navigate(['/dashboard/main']);
                  this.isSellerLoggedIn.next(true);
                  this.isLoginError.emit(false);
                }
              },
              error: (err) => {
                console.error('Signup failed:', err);
                this.isLoginError.emit(true);
              }
            });
        }
      },
      error: (err) => {
        console.error('Email check failed:', err);
        this.isLoginError.emit(true);
      }
    });
  }

  reloadSeller() {
    if (localStorage.getItem('seller')) {
      this.isSellerLoggedIn.next(true);
      this.router.navigate(['/dashboard/main']);
    }
  }

  userLogin(data: Login) {
    this.localApi.get(
      `${environment.localBaseUrl}/sellers`,
      new HttpParams()
        .set('email', data.email)
        .set('password', data.password)
    ).subscribe({
      next: (result: any) => {
        if (result && result.length === 1) {
          this.isLoginError.emit(false);
          localStorage.setItem('seller', JSON.stringify(result[0]));
          this.router.navigate(['/dashboard/main']);
          this.isSellerLoggedIn.next(true);
        } else {
          console.warn("login failed");
          this.isLoginError.emit(true);
        }
      },
      error: (err) => {
        console.error('Login failed:', err);
        this.isLoginError.emit(true);
      }
    });
  }

  signOut() {
  localStorage.removeItem('seller');
  this.isSellerLoggedIn.next(false); 
  this.router.navigate(['/auth/seller-login']);
}

}