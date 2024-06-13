import {Injectable} from "@angular/core";
import {environment} from "@env/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {FoodModel} from "../auth/model/food.model";


@Injectable({
  providedIn: 'root'
})
export class FoodService {
  readonly rootUrl = `${environment.estApiUrl}` + '/api/food';


  constructor(private http: HttpClient) {
  }

  getAllFoods(): Observable<FoodModel[]> {
    return this.http.get<FoodModel[]>(this.rootUrl);
  }
}
