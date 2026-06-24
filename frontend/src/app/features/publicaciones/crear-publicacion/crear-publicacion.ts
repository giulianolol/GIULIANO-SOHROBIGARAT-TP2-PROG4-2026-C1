import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { PostsService } from '../../../core/services/posts.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-crear-publicacion',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl:
    './crear-publicacion.html',
  styleUrl:
    './crear-publicacion.scss',
})



export class CrearPublicacion {

  loading = signal(false);

  errorMessage = signal('');

  selectedFile: File | null = null;

  postForm;

  constructor(
    private fb: FormBuilder,
    private postsService: PostsService,
    private authService: AuthService,
    private router: Router,
  ) {
    this.postForm =
      this.fb.nonNullable.group({
        titulo: [
          '',
          Validators.required,
        ],

        descripcion: [
          '',
          Validators.required,
        ],
      });
  }

submit() {

  if (this.postForm.invalid) {
    this.postForm.markAllAsTouched();
    return;
  }

  const user = JSON.parse(
    localStorage.getItem('user')!
  );

  this.loading.set(true);

  const crearPost = (
    imagenUrl = ''
  ) => {

    this.postsService.create({
      ...this.postForm.getRawValue(),
      autorId: user._id,
      imagenUrl,
    }).subscribe({

      next: () => {

        this.router.navigateByUrl(
          '/publicaciones',
        );
      },

      error: (err) => {

        this.errorMessage.set(
          err?.error?.message ||
          'Error al crear publicación',
        );

        this.loading.set(false);
      },

      complete: () => {

        this.loading.set(false);
      },
    });
  };

  if (this.selectedFile) {

    this.authService.upload(
      this.selectedFile,
    ).subscribe({

      next: (response) => {

        crearPost(
          response.imageUrl,
        );
      },

      error: () => {

        this.errorMessage.set(
          'No se pudo subir la imagen',
        );

        this.loading.set(false);
      },
    });

  } else {

    crearPost();
  }
}

onFileSelected(event: Event): void {
  const input =
    event.target as HTMLInputElement;

  if (
    input.files &&
    input.files.length > 0
  ) {
    this.selectedFile =
      input.files[0];
  }
}
}