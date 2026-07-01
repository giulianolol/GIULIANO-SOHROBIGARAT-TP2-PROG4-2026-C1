import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CapitalizePipe } from '../../shared/pipes/capitalize-pipe';

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
    private router: Router,
  ) {}

  get isAdmin() {
    return this.user?.perfil === 'administrador';
  }

  logout() {

    localStorage.removeItem('user');
    localStorage.removeItem('token');

    this.router.navigateByUrl('/login');

  }

}