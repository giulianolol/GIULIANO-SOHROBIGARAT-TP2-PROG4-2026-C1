import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CapitalizePipe } from '../../shared/pipes/capitalize-pipe';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CapitalizePipe],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {

  user = JSON.parse(
    localStorage.getItem('user') || 'null'
  );

  constructor(
    private authService: AuthService,
  ) {}

  get isAdmin() {
    return this.user?.perfil === 'administrador';
  }

  logout() {
    this.authService.logout();
  }

}