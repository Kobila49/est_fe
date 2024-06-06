import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon'; // If you are using icons
import {CommonModule} from '@angular/common';
import {Router} from "@angular/router";
import {AuthService} from "../auth/auth.service";
import {Principal} from "../auth/model/principal.model";
import {lastValueFrom} from "rxjs";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      const principal = new Principal();
      principal.email = this.loginForm.value.email;
      principal.password = this.loginForm.value.password;

      try {
        const result$ = this.authService.loginUser(principal);
        await lastValueFrom(result$);
        this.router.navigate(['/dashboard']).then(() => console.log('Navigated to dashboard'));
      } catch (error) {
        // handle error response
        console.error(error);
      }
    }
  }
}
