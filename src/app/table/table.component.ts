import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {EmissionService} from "../shared/emission.service";
import {DailyEmissionModel} from "../auth/model/dailyEmission.model";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSortModule]
})
export class TableComponent implements OnInit {

  // @ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ts-ignore
  @ViewChild(MatSort) sort: MatSort;
  // @ts-ignore
  dataSource: MatTableDataSource<any>;

  pageSize = 10;
  pageSizeOptions = [10, 50, 100];
  displayedColumns: string[] = ['date', 'transportationEmissionDailyTotal', 'utilityEmissionDailyTotal', 'foodEmissionDailyTotal', 'totalEmission'];

  constructor(private emissionService: EmissionService) {
  }

  ngOnInit() {
    this.emissionService.getEmissions().subscribe({
      next: (response: DailyEmissionModel[]) => {
        this.dataSource = new MatTableDataSource(response);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: err => {
        console.error('Error fetching emissions', err);
      }
    });
  }
}
