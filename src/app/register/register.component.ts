import {Component, OnInit} from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {CommonModule} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {UserDTO} from "../auth/model/register.model";
import {AuthService} from "../auth/auth.service";
import {Router} from "@angular/router";
import {lastValueFrom} from "rxjs";
import {MatNativeDateModule} from "@angular/material/core";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {DateHandlerUtil} from "../shared/date-handler.util";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  passwordsDoNotMatch: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      dateOfBirth: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.registerForm.valueChanges.subscribe(() => {
      this.checkPasswords();
    });
  }

  checkPasswords() {
    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('confirmPassword')?.value;
    this.passwordsDoNotMatch = password !== confirmPassword;

    if (this.passwordsDoNotMatch) {
      this.registerForm.get('confirmPassword')?.setErrors({mismatch: true});
    } else {
      this.registerForm.get('confirmPassword')?.setErrors(null);
    }
  }

  async onSubmit() {
    if (this.registerForm.valid && !this.passwordsDoNotMatch) {
      const registerDto: UserDTO = this.createRegisterUser(this.registerForm)

      try {
        this.successMessage = await lastValueFrom(this.authService.registerUser(registerDto));
        this.errorMessage = null;
        setTimeout(() => {
          this.router.navigate(['/login']).then(() => console.log('Navigated to login'));
        }, 2000);
      } catch (error) {
        // @ts-ignore
        this.errorMessage = error;
        this.successMessage = null;
      }
    }
  }

  private createRegisterUser(registerForm: FormGroup) {
    const registerUserDto: UserDTO = new UserDTO();
    registerUserDto.firstName = registerForm.get('firstName')?.value;
    registerUserDto.lastName = registerForm.get('lastName')?.value;
    registerUserDto.email = registerForm.get('email')?.value;
    registerUserDto.password = registerForm.get('password')?.value;
    registerUserDto.dateOfBirth = DateHandlerUtil.extractDateInWantedFormat(registerForm.get('dateOfBirth')?.value);
    return registerUserDto;
  }
}
