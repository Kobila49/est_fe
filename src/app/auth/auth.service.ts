import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Observable, throwError} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {environment} from '@env/environment';
import {Principal} from './model/principal.model';
import {CookieService} from "ngx-cookie-service";
import {UserDTO} from "./model/register.model";
import {ErrorHandlerUtil} from "../shared/error-handler.utils";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly rootUrl = `${environment.estApiUrl}`;
  readonly loginUrl = `${this.rootUrl}/api/auth/login`;
  readonly registerUrl = `${this.rootUrl}/api/auth/signup`;
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
      catchError(ErrorHandlerUtil.handleError<string>('loginUser'))
    );
  }

  registerUser(registerDto: UserDTO): Observable<string> {
    return this.http.post<any>(this.registerUrl, registerDto).pipe(
      map(() => 'Registration successful'),
      catchError((error: HttpErrorResponse) => {
        let errorMessage: string;
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}`;
        } else if (error.status === 409) {
          errorMessage = error.error.body || 'User with this email already exists.(fake)';
        } else {
          // Backend error
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        return throwError(() => new Error(errorMessage));
      })
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
    return this.http.post<any>(this.refreshTokenUrl, {token: refreshToken}).pipe(
      tap(response => {
        this.setToken(response.token);
      })
    );
  }

  logout(): void {
    this.cookieService.deleteAll('/');
    this.router.navigate(['login']).then(() => {
      console.log('User logged out');
    });
  }

  isLoggedIn() {
    return this.cookieService.check('token');
  }
}
