import {
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';

import {
  Router,
  RouterOutlet,
} from '@angular/router';

import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {

  protected readonly title = signal('frontend');
  loading = signal(true);

  private authService = inject(AuthService);
  private router = inject(Router);

  private warningTimer: any;
  private logoutTimer: any;

  ngOnInit() {

    const token = localStorage.getItem('token');

    if (!token) {
      this.loading.set(false);
      this.router.navigateByUrl('/login');
      return;
    }

    this.authService.authorize().subscribe({

      next: () => {

  setTimeout(() => {

    this.loading.set(false);
    this.router.navigateByUrl('/publicaciones');
    this.startSessionTimers();

  }, 3000);

},

      error: () => {

        localStorage.clear();
        this.loading.set(false);
        this.router.navigateByUrl('/login');

      },

    });

  }

  startSessionTimers() {

    this.clearTimers();

    this.warningTimer = setTimeout(() => {
      this.onSessionWarning();
    }, 10 * 60 * 1000);

    this.logoutTimer = setTimeout(() => {
      this.logout();
    }, 15 * 60 * 1000);
  }

  onSessionWarning() {

    const extend = confirm(
      'Tu sesión está por expirar. ¿Querés extenderla?'
    );

    if (extend) {
      this.refreshSession();
    } else {
      this.logout();
    }
  }

  refreshSession() {

    this.authService.refresh().subscribe({

      next: (res) => {

        localStorage.setItem('token', res.access_token);

        this.startSessionTimers();

      },

      error: () => {
        this.logout();
      },

    });

  }

  logout() {

    this.clearTimers();
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }

  clearTimers() {
    if (this.warningTimer) clearTimeout(this.warningTimer);
    if (this.logoutTimer) clearTimeout(this.logoutTimer);
  }
}