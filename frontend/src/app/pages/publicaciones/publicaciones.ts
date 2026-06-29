import { PostCard } from '../../components/post-card/post-card';
import { Router, RouterLink } from '@angular/router';
import { PostsService } from './../../core/services/posts.service';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../components/navbar/navbar';
import {
  Component,
  OnInit,
  signal,
} from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-publicaciones',
  standalone: true,
  templateUrl: './publicaciones.html',
  styleUrl: './publicaciones.scss',
  imports: [RouterLink, CommonModule, PostCard, Navbar],
})
export class Publicaciones implements OnInit {
  user = JSON.parse(
    localStorage.getItem('user') || 'null',
  );

  loadingLike = signal<string | null>(null);

  publicaciones = signal<any[]>([]);
  sort = 'fecha';

  errorMessage = signal<string>('');

  limit = 5;
  hasNextPage = true;
  offset = 0;

  constructor(
    private router: Router,
    private postsService: PostsService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.loadPosts();
  }

  get currentPage() {
  return this.offset / this.limit + 1;
}

loadPosts() {
  this.postsService
    .getPosts(
      this.sort,
      this.limit,
      this.offset,
    )
    .subscribe({
      next: (posts) => {
        this.publicaciones.set(posts);

        this.hasNextPage =
          posts.length === this.limit;
      },
      error: (err) => {
        console.error(err);
      },
    });
}

changeSort(sort: string) {
  this.sort = sort;
  this.loadPosts();
}

addLike(postId: string) {

  this.loadingLike.set(postId);

  this.postsService
    .addLike(postId, this.user._id)
    .subscribe({

      next: () => {
        this.loadPosts();
      },

      complete: () => {
        this.loadingLike.set(null);
      }

    });

}



removeLike(postId: string) {

  this.loadingLike.set(postId);

  this.postsService
    .removeLike(postId, this.user._id)
    .subscribe({
      next: () => {
        this.loadPosts();
      },

      complete: () => {
        this.loadingLike.set(null);
      },
      
      error: (err) => {
        console.error(err);
      },
    });
}

logout() {
    localStorage.removeItem('user');
    this.router.navigateByUrl('/login');
}

deletePost(postId: string) {
  this.postsService
    .deletePost(
      postId,
      this.user._id,
      this.user.perfil,
    )
    .subscribe({
      next: () => {
        this.loadPosts();
      },
      error: (err) => {
        console.error(err);
      },
    });
}

nextPage() {
  if (!this.hasNextPage) {
    return;
  }

  this.offset += this.limit;
  this.loadPosts();
}

previousPage() {
  if (this.offset >= this.limit) {
    this.offset -= this.limit;
    this.loadPosts();
  }
}

changeImage(
  event: Event,
  postId: string,
) {

  const input =
    event.target as HTMLInputElement;

  if (
    !input.files ||
    input.files.length === 0
  ) {
    return;
  }

  const file =
    input.files[0];

  this.authService.upload(
    file,
  ).subscribe({

    next: (response) => {

      this.postsService
        .updateImage(
          postId,
          response.imageUrl,
        )
        .subscribe(() => {

          this.loadPosts();
        });
    },
  });
}

removeImage(postId: string) {
  this.postsService.removeImage(postId).subscribe({
    next: () => {
      this.errorMessage.set('');
      this.loadPosts();
    },
    error: (err) => {
      console.error(err);
    },
  });
}



}

