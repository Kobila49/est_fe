import {Component, inject} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {AsyncPipe, NgIf, NgStyle} from '@angular/common';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {appRoutes} from "../app.routes";
import {Route, RouterLink, RouterLinkActive} from "@angular/router";
import {AuthService} from "../auth/auth.service";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    RouterLink,
    RouterLinkActive,
    NgIf,
    NgStyle,
  ]
})
export class LayoutComponent {
  private breakpointObserver = inject(BreakpointObserver);

  constructor(private authService: AuthService) {
  }

  rootRoutes = appRoutes.filter(r => r.path);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  showLink(item: Route) {
    const loginRegister = (item.path === 'login' || item.path === 'register');
    if (loginRegister && this.authService.isLoggedIn()) {
      return false;
    } else if (loginRegister && !this.authService.isLoggedIn()) {
      return true;
    }
    return this.authService.isLoggedIn();
  }

  logout() {
    this.authService.logout();
  }

  isAuthenticated() {
    return this.authService.isLoggedIn()
  }
}
