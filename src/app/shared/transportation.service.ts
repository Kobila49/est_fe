import {Injectable} from "@angular/core";
import {environment} from "@env/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {TransportationModel} from "../auth/model/transportation.model";


@Injectable({
  providedIn: 'root'
})
export class TransportationService {
  readonly rootUrl = `${environment.estApiUrl}` + '/api/transportation';


  constructor(private http: HttpClient) {
  }

  getAllTransportations(): Observable<TransportationModel[]> {
    return this.http.get<TransportationModel[]>(this.rootUrl);
  }
}
