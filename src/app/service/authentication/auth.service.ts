import { Injectable, Signal, WritableSignal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/model/User';
import { Authentication } from 'src/app/model/Authentication';
import { SharedLink } from 'src/app/model/SharedLink';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl = `${environment.baseUrl}/api/v1/login`;

  constructor(private http: HttpClient, private router: Router) { }

  login(username: string, password: string): Observable<Authentication> {
    return this.http.post<Authentication>(this.apiUrl, { username, password });
  }

  loginWithToken(sharedLink: SharedLink): Observable<Authentication> {
    return this.http.post<Authentication>(`${this.apiUrl}/token`, sharedLink);
  }

  isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return user != null;
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    this.router.navigate(["/login"]);
  }

}
