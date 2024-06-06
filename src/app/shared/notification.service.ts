import {Injectable} from "@angular/core";
import {MatSnackBar} from "@angular/material/snack-bar";


@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private _snackBar: MatSnackBar) {
  }

  showSuccessNotification(message: string): void {
    this._snackBar.open(message, 'Close', {
      duration: 3000, // Duration in milliseconds
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ["success-snackbar"]
    });
  }

  showErrorNotification(message: string): void {
    this._snackBar.open(message, 'Close', {
      duration: 3000, // Duration in milliseconds
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ["error-snackbar"]
    });
  }
}
