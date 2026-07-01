import {
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';

import { Router } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import {
  CommonModule,
} from '@angular/common';

import {
  FormsModule,
} from '@angular/forms';

import {
  UsersService,
} from '../../core/services/users.service';

@Component({
  selector: 'app-dashboard-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Navbar
  ],
  templateUrl: './dashboard-usuarios.html',
  styleUrl: './dashboard-usuarios.scss',
})
export class DashboardUsuarios
implements OnInit {
  private router = inject(Router);
  private usersService =
    inject(UsersService);

  usuarios = signal<any[]>([]);

  nuevoUsuario = {

    nombre: '',

    apellido: '',

    email: '',

    username: '',

    password: '',

    fechaNacimiento: '',

    descripcion: '',

    imagenPerfil: '',

    perfil: 'usuario',

  };

  ngOnInit() {

    const user = JSON.parse(
    localStorage.getItem('user')!
  );

    this.loadUsers();

  }

  loadUsers() {

    this.usersService
      .getUsers()
      .subscribe({

        next: (res) => {

          this.usuarios.set(res);

        },

      });

  }

  crearUsuario() {

    this.usersService
      .createUser(this.nuevoUsuario)
      .subscribe({

        next: () => {

          alert('Usuario creado');

          this.loadUsers();

        },

      });

  }

  deshabilitar(id: string) {

    this.usersService
      .disable(id)
      .subscribe({

        next: () => {

          this.loadUsers();

        },

      });

  }

  habilitar(id: string) {

    this.usersService
      .enable(id)
      .subscribe({

        next: () => {

          this.loadUsers();

        },

      });

  }

}