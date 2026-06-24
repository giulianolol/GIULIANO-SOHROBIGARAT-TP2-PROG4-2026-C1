import {
  Component,
  OnInit,
  signal,
} from '@angular/core';

import { RouterLink } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { PostsService } from './../../core/services/posts.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [RouterLink, Navbar, CommonModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss',
})
export class Perfil implements OnInit {

  user = JSON.parse(
    localStorage.getItem('user') || 'null',
  );

  misPosts = signal<any[]>([]);

  constructor(
    private postsService: PostsService,
  ) {}

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.postsService
      .getPostsByUser(this.user._id)
      .subscribe({
        next: (posts) => {
          this.misPosts.set(posts);
        },
        error: (err) => {
          console.error(err);
        },
      });
  }
}

