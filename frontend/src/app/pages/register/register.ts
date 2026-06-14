import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  errorMessage = '';
  loading = false;

  registerForm;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.registerForm = this.fb.nonNullable.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: [
        '',
        [Validators.required, Validators.email],
      ],
      username: ['', Validators.required],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            /^(?=.*[A-Z])(?=.*\d).{8,}$/,
          ),
        ],
      ],
      repetirPassword: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      descripcion: [''],
      imagenPerfil: [''],
    });
  }

  passwordsMatch(): boolean {
    return (
      this.registerForm.value.password ===
      this.registerForm.value.repetirPassword
    );
  }

  submit(): void {
    this.errorMessage = '';

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    if (!this.passwordsMatch()) {
      this.errorMessage =
        'Las contraseñas no coinciden';
      return;
    }

    this.loading = true;

    const body = {
      nombre: this.registerForm.getRawValue().nombre,
      apellido: this.registerForm.getRawValue().apellido,
      email: this.registerForm.getRawValue().email,
      username: this.registerForm.getRawValue().username,
      password: this.registerForm.getRawValue().password,
      fechaNacimiento:
        this.registerForm.getRawValue().fechaNacimiento,
      descripcion:
        this.registerForm.getRawValue().descripcion,
      imagenPerfil: '',
    };

    this.authService.register(body).subscribe({
      next: () => {
        this.router.navigateByUrl('/login');
      },
      error: (err) => {
        this.errorMessage =
          err?.error?.message ||
          'No se pudo registrar';

        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}