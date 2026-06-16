import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-publicaciones',
  standalone: true,
  templateUrl: './publicaciones.html',
  styleUrl: './publicaciones.scss',
  imports: [RouterLink]
})
export class Publicaciones {
  user = JSON.parse(
    localStorage.getItem('user') || 'null',
  );

  constructor(private router: Router) {}

  logout() {
    localStorage.removeItem('user');
    this.router.navigateByUrl('/login');
  }
}