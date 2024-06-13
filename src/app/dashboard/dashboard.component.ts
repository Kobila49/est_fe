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
import {NotificationService} from "../shared/notification.service";
import {MatIconModule} from "@angular/material/icon";
import {FoodModel} from "../auth/model/food.model";
import {FoodService} from "../shared/food.service";
import {UtilityModel} from "../auth/model/utility.model";
import {UtilityService} from "../shared/utility.service";
import {EmissionService} from "../shared/emission.service";
import {TransportationEmissionRecord} from "../auth/model/transportationEmission.model";
import {FoodEmissionRecord} from "../auth/model/foodEmission.model";
import {UtilityEmissionRecord} from "../auth/model/utilityEmission.model";
import {DailyEmissionModel} from "../auth/model/dailyEmission.model";
import {DateHandlerUtil} from "../shared/date-handler.util";

const utilityNamesMap: { [key: string]: string } = {
  'ELECTRICITY': 'Electricity',
  'NATURAL_GAS': 'Natural Gas',
  'WASTE': 'Waste'
};

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
    MatNativeDateModule,
    MatIconModule
  ]
})
export class DashboardComponent implements OnInit {
  dashboardForm: FormGroup;
  today = new Date();

  transportations: TransportationModel[] = [];
  transportationEmissionRecords: TransportationEmissionRecord[] = [];

  foods: FoodModel[] = [];
  foodEmissionRecords: FoodEmissionRecord[] = [];

  utilities: UtilityModel[] = [];
  utilitiesEmissionRecords: UtilityEmissionRecord[] = [];

  ngOnInit(): void {
    this.loadData().then(() => console.log('Data loaded'));
    this.loadDataForDate(new Date()).then(() => console.log('Data loaded for date'));
    this.dashboardForm.get('date')?.valueChanges.subscribe(value => {
      this.onDateChange(value).then(() => console.log('Data loaded for date'));
    });
  }

  constructor(private fb: FormBuilder,
              private transportationService: TransportationService,
              private foodService: FoodService,
              private utilityService: UtilityService,
              private emissionService: EmissionService,
              private notificationService: NotificationService) {
    this.dashboardForm = this.fb.group({
      date: [new Date()],
      transportationType: null,
      distance: null,
      utilityType: null,
      utilityConsumption: null,
      foodType: null,
      foodQuantity: null,
      transportationDaily: {value: null, disabled: true},
      utilityDaily: {value: null, disabled: true},
      foodDaily: {value: null, disabled: true},
      totalDaily: {value: null, disabled: true}
    });
  }

  calculateTotalCO2(): void {
    if (this.transportationEmissionRecords.length === 0
      || this.foodEmissionRecords.length === 0
      || this.utilitiesEmissionRecords.length === 0) {
      this.notificationService.showErrorNotification('Please add at least one transportation,food and utility emission record');
      return;
    }

    const wantedDate = DateHandlerUtil.extractDateInWantedFormat(this.dashboardForm.get('date')?.value);

    const dailyEmission = {
      date: wantedDate,
      transportationEmissionRecords: this.transportationEmissionRecords,
      foodEmissionRecords: this.foodEmissionRecords,
      utilityEmissionRecords: this.utilitiesEmissionRecords
    };
    this.emissionService.createEmission(dailyEmission).subscribe(
      {
        next: response => {
          this.populateDashboardFormFromResponse(response);
          this.notificationService.showSuccessNotification('Data saved successfully');
        },
        error: err => {
          ErrorHandlerUtil.handleError(err);
        }
      });
  }

  private async loadData() {
    await this.loadTransportations();
    await this.loadFoods();
    await this.loadUtilities();
  }

  private loadTransportations() {
    return new Promise<void>((resolve, reject) => {
      this.transportationService.getAllTransportations().subscribe(
        {
          next: response => {
            this.transportations = response;
            resolve();
          },
          error: err => {
            ErrorHandlerUtil.handleError(err);
            reject();
          }
        });
    });
  }

  private loadFoods() {
    return new Promise<void>((resolve, reject) => {
      this.foodService.getAllFoods().subscribe(
        {
          next: response => {
            this.foods = response;
            resolve();
          },
          error: err => {
            ErrorHandlerUtil.handleError(err);
            reject();
          }
        });
    });
  }

  private loadUtilities() {
    return new Promise<void>((resolve, reject) => {
      this.utilityService.getAllUtilities().subscribe(
        {
          next: response => {
            this.utilities = response;
            resolve();
          },
          error: err => {
            ErrorHandlerUtil.handleError(err);
            reject();
          }
        });
    });
  }


  addTransportationEmissionRecord() {
    const selectedId = this.dashboardForm.get('transportationType')?.value;
    const quantity = this.dashboardForm.get('distance')?.value;

    if (selectedId && quantity) {
      this.putIntoTransportationEmissionRecords(selectedId, quantity);
      this.dashboardForm.get('transportationType')?.reset();
      this.dashboardForm.get('distance')?.reset();
    } else {
      this.notificationService.showErrorNotification('Please select transportation type and enter distance');
    }
  }

  private putIntoTransportationEmissionRecords(selectedId: any, quantity: any) {
    this.transportationEmissionRecords.push({transportationId: selectedId, distance: quantity});
  }

  addUtilityEmissionRecord() {
    const selectedId = this.dashboardForm.get('utilityType')?.value;
    const quantity = this.dashboardForm.get('utilityConsumption')?.value;

    if (selectedId && quantity) {
      this.putIntoUtilityEmissionRecords(selectedId, quantity);
      this.dashboardForm.get('utilityType')?.reset();
      this.dashboardForm.get('utilityConsumption')?.reset();
    } else {
      this.notificationService.showErrorNotification('Please select transportation type and enter distance');
    }
  }

  private putIntoUtilityEmissionRecords(selectedId: any, quantity: any) {
    this.utilitiesEmissionRecords.push({utilityId: selectedId, consumption: quantity});
  }

  addFoodEmissionRecord() {
    const selectedId = this.dashboardForm.get('foodType')?.value;
    const quantity = this.dashboardForm.get('foodQuantity')?.value;

    if (selectedId && quantity) {
      this.putIntoFoodEmissionRecords(selectedId, quantity);
      this.dashboardForm.get('foodType')?.reset();
      this.dashboardForm.get('foodQuantity')?.reset();
    } else {
      this.notificationService.showErrorNotification('Please select food type and enter quantity');
    }
  }

  private putIntoFoodEmissionRecords(selectedId: any, quantity: any) {
    this.foodEmissionRecords.push({foodId: selectedId, consumption: quantity});
  }

  getTransportationNameById(id: number) {
    const transportation = this.transportations.find(t => t.id === id);
    return transportation ? transportation.name : 'Unknown';
  }

  getUtilityById(id: number) {
    const utility = this.utilities.find(t => t.id === id);
    return utility ? this.beautifyName(utility.type) : 'Unknown';
  }

  getFoodNameById(id: number) {
    const food = this.foods.find(t => t.id === id);
    return food ? food.name : 'Unknown';
  }

  removeTransportationEmission(id: number) {
    const index = this.transportationEmissionRecords
      .findIndex(record => record.transportationId === id);
    if (index !== -1) {
      this.transportationEmissionRecords.splice(index, 1);
    } else {
      console.warn(`Utility with ID ${id} not found`);
    }
  }

  removeUtilityEmission(id: number) {
    const index = this.utilitiesEmissionRecords
      .findIndex(record => record.utilityId === id);
    if (index !== -1) {
      this.utilitiesEmissionRecords.splice(index, 1);
    } else {
      console.warn(`Utility with ID ${id} not found`);
    }
  }

  removeFoodEmission(id: number) {
    const index = this.foodEmissionRecords
      .findIndex(record => record.foodId === id);
    if (index !== -1) {
      this.foodEmissionRecords.splice(index, 1);
    } else {
      console.warn(`Utility with ID ${id} not found`);
    }
  }

  checkIfExistsTP(id: number | undefined) {
    const record = this.transportationEmissionRecords
      .find(t => t.transportationId === id);
    return record != null;
  }

  checkIfExistsFood(id: number | undefined) {
    const record = this.foodEmissionRecords
      .find(t => t.foodId === id);
    return record != null;
  }

  checkIfExistsUtility(id: number | undefined) {
    const record = this.utilitiesEmissionRecords
      .find(t => t.utilityId === id);
    return record != null;
  }

  beautifyName(type: any) {
    return utilityNamesMap[type] || type;
  }

  getUtilityMeasurementUnit() {
    const selectedUtility = this.dashboardForm.get('utilityType')?.value;
    const utility = this.utilities.find(u => u.id === selectedUtility);
    return utility ? utility.measurementUnit : '';
  }

  getUtilityMeasurementUnitById(id: number) {
    const utility = this.utilities.find(u => u.id === id);
    return utility ? utility.measurementUnit : '';
  }

  private populateDashboardFormFromResponse(response: DailyEmissionModel) {
    this.transportationEmissionRecords.length = 0;
    this.foodEmissionRecords.length = 0;
    this.utilitiesEmissionRecords.length = 0;
    response.transportationEmissionRecords?.forEach(record => {
      this.putIntoTransportationEmissionRecords(record.transportationId, record.distance);
    });
    response.foodEmissionRecords?.forEach(record => {
      this.putIntoFoodEmissionRecords(record.foodId, record.consumption);
    });
    response.utilityEmissionRecords?.forEach(record => {
      this.putIntoUtilityEmissionRecords(record.utilityId, record.consumption);
    });

    this.dashboardForm.patchValue({
      transportationDaily: response.transportationEmissionDailyTotal,
      utilityDaily: response.utilityEmissionDailyTotal,
      foodDaily: response.foodEmissionDailyTotal,
      totalDaily: response.totalEmission
    });
  }

  private async onDateChange(value: any) {
    await this.loadDataForDate(value);
  }

  private async loadDataForDate(date: any) {
    this.resetAllData();
    this.emissionService.getEmissionByDate(DateHandlerUtil.extractDateInWantedFormat(date)).subscribe(
      {
        next: response => {
          this.populateDashboardFormFromResponse(response);
          this.notificationService.showSuccessNotification('Data loaded successfully');
        },
        error: err => {
          ErrorHandlerUtil.handleError(err);
        }
      });
  }

  private resetAllData() {
    this.transportationEmissionRecords.length = 0;
    this.foodEmissionRecords.length = 0;
    this.utilitiesEmissionRecords.length = 0;
    this.dashboardForm.patchValue({
      transportationDaily: null,
      utilityDaily: null,
      foodDaily: null,
      totalDaily: null
    });
  }

  dateFilter = (date: Date | null): boolean => {
    const currentDate = date || new Date();
    return currentDate <= this.today;
  }
}
