import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const userToken = localStorage.getItem('user');
    const sellerToken = localStorage.getItem('seller');
    const token = userToken || sellerToken;
    const parsedToken = token ? JSON.parse(token).token : null;
    const lang = localStorage.getItem('lang') || 'en';

    let authReq = request.clone({
      setHeaders: {
        'Accept-Language': lang,
        'Content-Type': 'application/json'
      }
    });

    if (parsedToken) {
      authReq = authReq.clone({
        setHeaders: {
          'Authorization': `Bearer ${parsedToken}`
        }
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          localStorage.removeItem('user');
          localStorage.removeItem('seller');
          this.router.navigate(['/auth/user-login']);
        }
        return throwError(() => error);
      })
    );
  }
}