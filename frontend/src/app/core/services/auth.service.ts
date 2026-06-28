import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginRequest {
  usuario: string;
  password: string;
}

export interface UserResponse {
  _id: string;
  nombre: string;
  apellido: string;
  email: string;
  username: string;
  fechaNacimiento: string;
  descripcion: string;
  imagenPerfil: string;
  perfil: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'https://giuliano-sohrobigarat-tp2-prog4-2026-c1.onrender.com/auth';
  // private apiUrl =
// 'http://localhost:3000/auth';

  login(body: LoginRequest) {
  return this.http.post<{
    access_token: string;
    user: UserResponse;
  }>(
    `${this.apiUrl}/login`,
    body,
  );
}

  register(body: any) {
    return this.http.post(
      `${this.apiUrl}/register`,
      body,
    );
  }

  upload(file: File) {
    const formData = new FormData();

    formData.append('file', file);

    return this.http.post<{
      imageUrl: string;
    }>(
      `${this.apiUrl}/upload`,
      formData,
    );
  }

  authorize() {
  return this.http.post<{
    valid: boolean;
    user: UserResponse;
  }>(
    `${this.apiUrl}/authorize`,
    {},
  );
}

refresh() {
  return this.http.post<{
    access_token: string;
  }>(
    `${this.apiUrl}/refresh`,
    {},
  );
}
}