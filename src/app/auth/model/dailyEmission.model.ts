import {TransportationEmissionRecord} from "./transportationEmission.model";
import {FoodEmissionRecord} from "./foodEmission.model";
import {UtilityEmissionRecord} from "./utilityEmission.model";

export class DailyEmissionModel {
  id?: number;
  date?: string;
  transportationEmissionRecords?: TransportationEmissionRecord[];
  transportationEmissionDailyTotal?: number;
  foodEmissionRecords?: FoodEmissionRecord[];
  foodEmissionDailyTotal?: number;
  utilityEmissionRecords?: UtilityEmissionRecord[];
  utilityEmissionDailyTotal?: number;
  totalEmission?: number;
}
