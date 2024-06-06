import {Injectable} from "@angular/core";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {environment} from "@env/environment";
import {catchError, tap} from "rxjs/operators";
import {ErrorHandlerUtil} from "./error-handler.utils";
import {Observable} from "rxjs";
import {UserDTO} from "../auth/model/register.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  readonly rootUrl = `${environment.estApiUrl}`;
  readonly userUrl = `${this.rootUrl}/api/user/me`;


  constructor(private http: HttpClient,
              private cookieService: CookieService) {
  }

  getUser(): Observable<any> {
    return this.http.get<HttpResponse<any>>(this.userUrl, {observe: 'response'}).pipe(
      tap((res: HttpResponse<any>) => {
        if (res.body) {
          this.cookieService.set('current-user', JSON.stringify(res.body), {
            path: '/',
            secure: true,
            sameSite: 'Strict'
          });
        }
      }),
      catchError(ErrorHandlerUtil.handleError<string>('getUser'))
    );
  }

  updateUser(user: UserDTO) {
    return this.http.put<any>(this.userUrl, user).pipe(
      tap(() => {
        this.cookieService.set('current-user', JSON.stringify(user), {path: '/', secure: true, sameSite: 'Strict'});
        console.log(this.cookieService.get('current-user'));
      }),
      catchError(ErrorHandlerUtil.handleError<string>('updateUser'))
    );
  }
}
