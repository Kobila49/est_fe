import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatNativeDateModule} from "@angular/material/core";
import {TransportationService} from "../shared/transportation.service";
import {ErrorHandlerUtil} from "../shared/error-handler.utils";
import {TransportationModel} from "../auth/model/transportation.model";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatNativeDateModule
  ]
})
export class DashboardComponent implements OnInit {
  dashboardForm: FormGroup;

  transportations: TransportationModel[] | undefined;

  ngOnInit(): void {
    this.loadTransportations();
  }

  constructor(private fb: FormBuilder,
              private transportationService: TransportationService) {
    this.dashboardForm = this.fb.group({
      date: [new Date()],
      transportationType: [''],
      distance: [''],
      electricityConsumption: [''],
      naturalGasUsage: [''],
      beef: [''],
      chicken: [''],
      cheese: [''],
      milk: [''],
      wasteTotal: [''],
      naturalGasDaily: {value: null, disabled: true},
      transportationDaily: {value: null, disabled: true},
      electricityDaily: {value: null, disabled: true},
      foodDaily: {value: null, disabled: true},
      wasteDaily: {value: null, disabled: true}
    });
  }

  calculateTotalCO2(): void {
    // Add your calculation logic here
  }

  private loadTransportations() {
    this.transportationService.getAllTransportations().subscribe(
      {
        next: response => this.transportations = response,
        error: err => ErrorHandlerUtil.handleError(err)
      });
  }
}
