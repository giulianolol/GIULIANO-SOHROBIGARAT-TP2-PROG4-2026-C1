import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

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

  postForm;

  constructor(
    private fb: FormBuilder,
    private postsService: PostsService,
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

  this.postsService.create({
    ...this.postForm.getRawValue(),
    autorId: user._id,
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
}
}