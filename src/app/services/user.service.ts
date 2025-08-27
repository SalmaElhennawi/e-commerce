import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Login, Register } from '../models/data-model';
import { LocalApiService } from './local-api.service';
import { environment } from '../../environments/environment';
import { HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  isUserLoggedIn = new BehaviorSubject<boolean>(false);
  invalidUserAuth = new EventEmitter<boolean>(false);
  currentUser: any;
  

  constructor(
    private localApi: LocalApiService,
    private router: Router
  ) { }

  userSignUp(user: Register) {
    this.localApi.get(
      `${environment.localBaseUrl}/users`,
      new HttpParams().set('email', user.email)
    ).subscribe({
      next: (existingUsers) => {
        if (existingUsers && existingUsers.length > 0) {
          this.invalidUserAuth.emit(true);
        } else {
          this.localApi.post(`${environment.localBaseUrl}/users`, user)
            .subscribe({
              next: (result) => {
                if (result) {
                  localStorage.setItem('user', JSON.stringify(result));
                  this.router.navigate(['/home']);
                  this.invalidUserAuth.emit(false);
                }
              },
              error: (err) => {
                console.error('Signup failed:', err);
                this.invalidUserAuth.emit(true);
              }
            });
        }
      },
      error: (err) => {
        console.error('Email check failed:', err);
        this.invalidUserAuth.emit(true);
      }
    });
  }

  userLogin(data: Login) {
    this.localApi.get(
      `${environment.localBaseUrl}/users`,
      new HttpParams()
        .set('email', data.email)
        .set('password', data.password)
    ).subscribe({
      next: (result) => {
        if (result && result.length) {
          localStorage.setItem('user', JSON.stringify(result[0]));
          this.isUserLoggedIn.next(true);
          this.router.navigate(['/home']);
          this.invalidUserAuth.emit(false);
        } else {
          this.invalidUserAuth.emit(true);
        }
      },
      error: (err) => {
        console.error('Login failed:', err);
        this.invalidUserAuth.emit(true);
      }
    });
  }

  signOut() {
  localStorage.removeItem('user');
  this.isUserLoggedIn.next(false); 
  this.router.navigate(['/auth/user-login']);
}
}