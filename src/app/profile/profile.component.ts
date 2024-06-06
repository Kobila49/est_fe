import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {CommonModule} from "@angular/common";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {CookieService} from "ngx-cookie-service";
import {User} from "../auth/model/user.model";
import {UserDTO} from "../auth/model/register.model";
import {DateHandlerUtil} from "../shared/date-handler.util";
import {UserService} from "../shared/user.service";
import {NotificationService} from "../shared/notification.service";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatSelectModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  passwordsDoNotMatch: boolean = false;

  constructor(private fb: FormBuilder,
              private userService: UserService,
              private cookieService: CookieService,
              private notificationService: NotificationService) {
    this.profileForm = this.fb.group({
      email: [{value: '', disabled: true}, [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.profileForm.valueChanges.subscribe(() => {
      this.checkPasswords();
    });
    const user = this.getUserFromCookie();
    if (user) {
      this.profileForm.patchValue({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        dateOfBirth: new Date(user.dateOfBirth)
      });
    }
  }

  async onSubmit(): Promise<void> {
    if (this.profileForm.valid && !this.passwordsDoNotMatch) {
      const userDto: UserDTO = this.userProfileDTO(this.profileForm)
      try {
        this.userService.updateUser(userDto).subscribe();
        this.notificationService.showSuccessNotification('Profile updated successfully');
      } catch (error) {
        this.notificationService.showErrorNotification('Error updating profile');
      }
    }
  }

  getUserFromCookie(): User | null {
    const userJson = this.cookieService.get('current-user');
    try {
      return JSON.parse(userJson);
    } catch (e) {
      console.error('Error parsing user data from cookie', e);
      return null;
    }
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  checkPasswords() {
    const password = this.profileForm.get('password')?.value;
    const confirmPassword = this.profileForm.get('confirmPassword')?.value;
    this.passwordsDoNotMatch = password !== confirmPassword;

    if (this.passwordsDoNotMatch) {
      this.profileForm.get('confirmPassword')?.setErrors({mismatch: true});
    } else {
      this.profileForm.get('confirmPassword')?.setErrors(null);
    }
  }

  private userProfileDTO(profileForm: FormGroup) {
    const userProfile: UserDTO = new UserDTO();
    userProfile.firstName = profileForm.get('firstName')?.value;
    userProfile.lastName = profileForm.get('lastName')?.value;
    userProfile.email = profileForm.get('email')?.value;
    userProfile.password = profileForm.get('password')?.value;
    userProfile.dateOfBirth = DateHandlerUtil.extractDateInWantedFormat(profileForm.get('dateOfBirth')?.value);
    return userProfile;
  }
}
