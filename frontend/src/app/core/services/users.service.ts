import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UsersService {

  private http = inject(HttpClient);

  private apiUrl =
    'http://localhost:3000/users';

  getUsers() {
    return this.http.get<any[]>(this.apiUrl);
  }

  createUser(body: any) {
    return this.http.post(
      this.apiUrl,
      body,
    );
  }

  disable(id: string) {
    return this.http.delete(
      `${this.apiUrl}/${id}`,
    );
  }

  enable(id: string) {
    return this.http.post(
      `${this.apiUrl}/${id}/enable`,
      {},
    );
  }

}