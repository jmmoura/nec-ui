import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor() { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem("accessToken");

    if (token && !req.url.includes('login')) {
      const cloned = req.clone({
        headers: req.headers.set("Authorization", token)
      });

      return next.handle(cloned);
    } else {
      return next.handle(req);
    }

  }
}
