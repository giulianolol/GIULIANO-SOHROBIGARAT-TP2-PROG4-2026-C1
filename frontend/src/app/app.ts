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

import { NgIf } from '@angular/common';
import { AuthService } from './core/services/auth.service';
import { SessionModal } from './components/session-modal/session-modal';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf, SessionModal],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {

  protected readonly title = signal('frontend');
  loading = signal(true);

  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {

    const token = localStorage.getItem('token');

    if (!token) {
      this.loading.set(false);
      this.router.navigateByUrl('/login');
      return;
    }

    this.authService.authorize().subscribe({
      next: () => {
        this.loading.set(false);
        this.authService.startSessionTimers();
      },
      error: () => {
        localStorage.clear();
        this.loading.set(false);
        this.router.navigateByUrl('/login');
      }
    });
  }
}