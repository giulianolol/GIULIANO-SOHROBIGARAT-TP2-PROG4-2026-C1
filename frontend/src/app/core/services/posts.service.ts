import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private http = inject(HttpClient);
private apiUrl = 'http://localhost:3000/posts';
  // private apiUrl =
  // 'https://giuliano-sohrobigarat-tp2-prog4-2026-c1.onrender.com/posts';

 getPosts(
  sort = 'fecha',
  limit = 5,
  offset = 0,
) {
  return this.http.get<any[]>(
    `${this.apiUrl}?sort=${sort}&limit=${limit}&offset=${offset}&t=${Date.now()}`
  );
}
  addLike(
    postId: string,
    userId: string,
  ) {
    return this.http.post(
      `${this.apiUrl}/${postId}/like`,
      { userId },
    );
  }

  removeLike(
    postId: string,
    userId: string,
  ) {
    return this.http.delete(
      `${this.apiUrl}/${postId}/like`,
      {
        body: { userId },
      },
    );
  }

  deletePost(
    postId: string,
    userId: string,
    perfil: string,
  ) {
    return this.http.delete(
      `${this.apiUrl}/${postId}`,
      {
        body: {
          userId,
          perfil,
        },
      },
    );
  }
  
create(body: {
  titulo: string;
  descripcion: string;
  autorId: string;
  imagenUrl?: string;
})
{
  return this.http.post(
    `${this.apiUrl}`,
    body,
  );
}

  getPostsByUser(userId: string) {
  return this.http.get<any[]>(
    `${this.apiUrl}?autorId=${userId}&limit=3&t=${Date.now()}`
  );
}

removeImage(postId: string) {
  return this.http.delete(
    `${this.apiUrl}/${postId}/image`
  );
}

updateImage(
  postId: string,
  imagenUrl: string,
) {
  return this.http.patch(
    `${this.apiUrl}/${postId}/image`,
    { imagenUrl },
  );
}
}