import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-session-modal',
  standalone: true,
  templateUrl: './session-modal.html',
  styleUrl: './session-modal.scss',
})
export class SessionModal {

  authService = inject(AuthService);

  extend() {
    this.authService.extendSession();
  }

  cancel() {
    this.authService.cancelSession();
  }
}