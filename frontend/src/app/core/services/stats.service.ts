import { Injectable, inject } from '@angular/core';
import {
  HttpClient,
  HttpParams,
} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class StatsService {

  private http = inject(HttpClient);

  private api =
    'https://giuliano-sohrobigarat-tp2-prog4-2026-c1.onrender.com/posts/stats';

  // private api =
  // 'http://localhost:3000/posts/stats';

  getPostsByUser(
    desde?: string,
    hasta?: string,
  ) {

    let params = new HttpParams();

    if (desde) {
      params = params.set('desde', desde);
    }

    if (hasta) {
      params = params.set('hasta', hasta);
    }

    return this.http.get<any[]>(
      `${this.api}/posts-by-user`,
      { params },
    );

  }

  getCommentsByDate(
    desde?: string,
    hasta?: string,
  ) {

    let params = new HttpParams();

    if (desde) {
      params = params.set('desde', desde);
    }

    if (hasta) {
      params = params.set('hasta', hasta);
    }

    return this.http.get<any[]>(
      `${this.api}/comments-by-date`,
      { params },
    );

  }

  getCommentsByPost(
    desde?: string,
    hasta?: string,
  ) {

    let params = new HttpParams();

    if (desde) {
      params = params.set('desde', desde);
    }

    if (hasta) {
      params = params.set('hasta', hasta);
    }

    return this.http.get<any[]>(
      `${this.api}/comments-by-post`,
      { params },
    );

  }

}