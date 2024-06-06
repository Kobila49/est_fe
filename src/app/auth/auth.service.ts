import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {environment} from '@env/environment';
import {Principal} from './model/principal.model';
import {CookieService} from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly rootUrl = `${environment.estApiUrl}`;
  readonly loginUrl = `${this.rootUrl}/api/auth/login`;
  readonly refreshTokenUrl = `${this.rootUrl}/api/auth/refresh-token`;

  constructor(private http: HttpClient, private router: Router, private cookieService: CookieService) {
  }

  loginUser(principal: Principal): Observable<any> {
    return this.http.post<any>(this.loginUrl, principal, {observe: 'response'}).pipe(
      tap(res => {
        if (res.body) {
          const authToken = res.body.token;
          const refreshToken = res.body.refreshToken;
          this.setToken(authToken);
          this.setRefreshToken(refreshToken);
        }
      }),
      catchError(this.handleError<any>('loginUser'))
    );
  }

  private setToken(token: string): void {
    this.cookieService.set('token', token, {path: '/', secure: true, sameSite: 'Strict'});
  }

  private setRefreshToken(refreshToken: string): void {
    this.cookieService.set('refreshToken', refreshToken, {path: '/', secure: true, sameSite: 'Strict'});
  }

  getToken(): string {
    return this.cookieService.get('token');
  }

  getRefreshToken(): string {
    return this.cookieService.get('refreshToken');
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    if (refreshToken) {
      return this.http.post<any>(this.refreshTokenUrl, {refreshToken}, {observe: 'response'}).pipe(
        tap(res => {
          if (res.body) {
            const authToken = `${res.body.type} ${res.body.token}`;
            this.setToken(authToken);
          }
        }),
        catchError(err => {
          this.logout();
          return throwError(() => err)
        })
      );
    } else {
      this.logout();
      return throwError(() => 'No refresh token available');
    }
  }

  logout(): void {
    this.cookieService.delete('token', '/');
    this.cookieService.delete('refreshToken', '/');
    this.router.navigate(['login']).then(() => {
      console.log('User logged out');
    });
  }

  private handleError<T>(operation = 'operation') {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return throwError(() => new Error(error));
    };
  }

  isLoggedIn() {
    return this.cookieService.check('token');
  }
}
