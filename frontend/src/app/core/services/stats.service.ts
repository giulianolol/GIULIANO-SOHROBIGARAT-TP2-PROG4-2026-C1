import { Injectable, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class StatsService {

  private http = inject(HttpClient);

  private api =
  'https://giuliano-sohrobigarat-tp2-prog4-2026-c1.onrender.com/posts/stats';

  // private api =
    // 'http://localhost:3000/posts/stats';

  getPostsByUser() {

    return this.http.get<any[]>(
      `${this.api}/posts-by-user`
    );

  }

  getCommentsByDate() {

    return this.http.get<any[]>(
      `${this.api}/comments-by-date`
    );

  }

  getCommentsByPost() {

    return this.http.get<any[]>(
      `${this.api}/comments-by-post`
    );

  }

}