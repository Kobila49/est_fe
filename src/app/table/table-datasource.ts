import { MatTableDataSource } from '@angular/material/table';
import { DailyEmissionModel } from '../auth/model/dailyEmission.model';

export class TableDataSource extends MatTableDataSource<DailyEmissionModel> {
  constructor(data: DailyEmissionModel[]) {
    super(data);
  }
}
