import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { signal } from '@angular/core';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  // errorMessage = '';
  // loading = false;

  loginForm;

  errorMessage = signal('');
  loading = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.loginForm = this.fb.nonNullable.group({
      usuario: ['', [Validators.required]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Z])(?=.*\d).{8,}$/),
        ],
      ],
    });
  }

submit(): void {
  console.log('1 - Entré al submit');

  this.errorMessage.set('');

  if (this.loginForm.invalid) {
    console.log('2 - Formulario inválido');
    this.loginForm.markAllAsTouched();
    return;
  }

  console.log('3 - Formulario válido');
  console.log(this.loginForm.getRawValue());

  this.loading.set(true);

  console.log('4 - Antes del login');

  this.authService.login(this.loginForm.getRawValue()).subscribe({
    next: (user) => {
      console.log('5 - SUCCESS', user);

      localStorage.setItem(
        'user',
        JSON.stringify(user),
      );

      this.router.navigateByUrl(
        '/publicaciones',
      );
    },

    error: (err) => {
      console.log('6 - ERROR', err);

      this.errorMessage.set(
        err?.error?.message ||
        'No se pudo iniciar sesión'
      );

      this.loading.set(false);
    },

    complete: () => {
      console.log('7 - COMPLETE');

      this.loading.set(false);
    },
  });
}
}