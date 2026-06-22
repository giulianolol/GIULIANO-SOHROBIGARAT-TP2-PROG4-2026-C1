import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  user = JSON.parse(
    localStorage.getItem('user') || 'null'
  );

  constructor(private router: Router) {}

  logout() {
    localStorage.removeItem('user');
    this.router.navigateByUrl('/login');
  }
}