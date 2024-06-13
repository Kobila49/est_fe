import {Injectable} from "@angular/core";
import {environment} from "@env/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {DailyEmissionModel} from "../auth/model/dailyEmission.model";

@Injectable({
  providedIn: 'root'
})
export class EmissionService {
  readonly rootUrl = `${environment.estApiUrl}` + '/api/emission';


  constructor(private http: HttpClient) {
  }

  createEmission(emission: DailyEmissionModel): Observable<DailyEmissionModel> {
    return this.http.post<DailyEmissionModel>(this.rootUrl, emission);
  }

  getEmissionByDate(date: string): Observable<DailyEmissionModel> {
    return this.http.get<DailyEmissionModel>(this.rootUrl, {params: {date: date}});
  }

  getEmissions(): Observable<DailyEmissionModel[]> {
    return this.http.get<DailyEmissionModel[]>(this.rootUrl + "/all");
  }
}
