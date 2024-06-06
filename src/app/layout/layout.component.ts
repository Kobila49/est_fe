import {Component, inject} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {AsyncPipe, NgIf} from '@angular/common';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {appRoutes} from "../app.routes";
import {Route, Router, RouterLink, RouterLinkActive} from "@angular/router";
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
  ]
})
export class LayoutComponent {
  private breakpointObserver = inject(BreakpointObserver);

  constructor(private authService: AuthService, private router: Router) {
  }

  rootRoutes = appRoutes.filter(r => r.path);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  showLink(item: Route) {
    if (item.path === 'login' && this.authService.isLoggedIn()) {
      return false;
    }

    return this.authService.isLoggedIn();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login'])
      .then(r => console.log('navigated to login'));
  }

  isAuthenticated() {
    return this.authService.isLoggedIn()
  }
}
