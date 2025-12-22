import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl = `${environment.baseUrl}/api/v1/auth`;

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<boolean> {
    if (!username || !password) return of(false);
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { username, password }).pipe(
      map(res => {
        try {
          if (res && res.token) {
            localStorage.setItem('auth_token', res.token);
            return true;
          }
        } catch { }
        return false;
      }),
      catchError(() => of(false))
    );
  }
}
