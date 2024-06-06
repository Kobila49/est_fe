import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, switchMap, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AuthService} from "./auth.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    let authReq = req;

    if (!this.isSkippedEndpoint(req.url) && token) {
      authReq = this.cloneRequestWithNewToken(token, req)
    }


    return next.handle(authReq).pipe(
      // @ts-ignore
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.authService.refreshToken().pipe(
            switchMap((newToken: any) => {
              const newAuthReq = this.cloneRequestWithNewToken(newToken.token, req);
              return next.handle(newAuthReq);
            }),
            catchError((refreshError) => {
              return throwError(() => refreshError);
            })
          );
        } else {
          this.authService.logout();
          throwError(() => error);
        }
      })
    );
  }

  cloneRequestWithNewToken(token: any, req: HttpRequest<any>) {
    return req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
  }

  private isSkippedEndpoint(url: string): boolean {
    const skippedEndpoints = [
      '/login',
      '/signup',
      '/refresh-token'
    ];
    return skippedEndpoints.some(endpoint => url.includes(endpoint));
  }
}
