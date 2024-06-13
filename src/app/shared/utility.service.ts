import {Injectable} from "@angular/core";
import {environment} from "@env/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {UtilityModel} from "../auth/model/utility.model";


@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  readonly rootUrl = `${environment.estApiUrl}` + '/api/utility';

  constructor(private http: HttpClient) {
  }

  getAllUtilities(): Observable<UtilityModel[]> {
    return this.http.get<UtilityModel[]>(this.rootUrl);
  }
}
