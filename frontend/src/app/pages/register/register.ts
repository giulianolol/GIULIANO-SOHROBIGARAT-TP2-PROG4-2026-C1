import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
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
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  errorMessage = signal('');
  loading = signal(false);

  selectedFile: File | null = null;

  registerForm;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.registerForm = this.fb.nonNullable.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Z])(?=.*\d).{8,}$/),
        ],
      ],
      repetirPassword: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      descripcion: [''],
      imagenPerfil: [''],
    });
  }

  hasError(controlName: string): boolean {
    const ctrl = this.registerForm.get(controlName);
    return !!ctrl && ctrl.touched && ctrl.invalid;
  }

  passwordsMatch(): boolean {
    return (
      this.registerForm.value.password ===
      this.registerForm.value.repetirPassword
    );
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  submit(): void {
    this.errorMessage.set('');

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    if (!this.passwordsMatch()) {
      this.errorMessage.set('Las contraseñas no coinciden');
      return;
    }

    this.loading.set(true);

    const registerUser = (imageUrl = '') => {
      const body = {
        ...this.registerForm.getRawValue(),
        imagenPerfil: imageUrl,
      };

      this.authService.register(body).subscribe({
        next: () => this.router.navigateByUrl('/login'),
        error: (err) => {
          this.errorMessage.set(
            err?.error?.message || 'No se pudo registrar',
          );
          this.loading.set(false);
        },
        complete: () => this.loading.set(false),
      });
    };

    if (this.selectedFile) {
      this.authService.upload(this.selectedFile).subscribe({
        next: (response) => registerUser(response.imageUrl),
        error: () => {
          this.errorMessage.set('No se pudo subir la imagen');
          this.loading.set(false);
        },
      });
    } else {
      registerUser();
    }
  }
}