import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatTable, MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {EmissionService} from "../shared/emission.service";
import {DailyEmissionModel} from "../auth/model/dailyEmission.model";
import {ErrorHandlerUtil} from "../shared/error-handler.utils";
import {CommonModule} from "@angular/common";
import {TableDataSource} from "./table-datasource";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSortModule]
})
export class TableComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: TableDataSource;
  dataSource: DailyEmissionModel[] = [];

  displayedColumns = [
    'date',
    'transportationEmissionDailyTotal',
    'utilityEmissionDailyTotal',
    'foodEmissionDailyTotal',
    'totalEmission'
  ];

  constructor(private emissionService: EmissionService) {
  }

  ngAfterViewInit(): void {
    this.emissionService.getEmissions().subscribe(
      {
        next: (response: DailyEmissionModel[]) => {
          this.dataSource = response;
          this.table.data = this.dataSource;
          this.table.sort = this.sort; // Set the MatSort on the table data source
          this.table.paginator = this.paginator; // Set the MatPaginator on the table data source
        },
        error: err => {
          ErrorHandlerUtil.handleError(err);
        }
      });
  }
}
