import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
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
  private router = inject(Router);

  showSessionModal = signal(false);

  // private apiUrl = 'http://localhost:3000/auth';
  private apiUrl =
  'https://giuliano-sohrobigarat-tp2-prog4-2026-c1.onrender.com/auth';

  private warningTimer: any;
  private logoutTimer: any;

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

  // ---- SESIÓN ----

  startSessionTimers() {

    this.clearTimers();

    const token = localStorage.getItem('token');
    if (!token) return;

    const expiration = this.getTokenExpiration(token);
    if (!expiration) return;

    const msHastaExpirar = expiration - Date.now();
    const msHastaWarning = msHastaExpirar - 10 * 1000;

    console.log('ms hasta expirar:', msHastaExpirar);
    console.log('ms hasta warning:', msHastaWarning);

    this.warningTimer = setTimeout(() => {
      this.onSessionWarning();
    }, Math.max(msHastaWarning, 0));

    this.logoutTimer = setTimeout(() => {
      this.logout();
    }, Math.max(msHastaExpirar, 0));
  }

 onSessionWarning() {
    this.showSessionModal.set(true);
  }
  extendSession() {
    this.showSessionModal.set(false);
    this.refreshSession();
  }
  cancelSession() {
    this.showSessionModal.set(false);
    this.logout();
  }

  refreshSession() {
    this.refresh().subscribe({
      next: (res) => {
        localStorage.setItem('token', res.access_token);
        this.startSessionTimers();
      },
      error: () => {
        this.logout();
      },
    });
  }

  logout() {
    this.showSessionModal.set(false);
    this.clearTimers();
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }

  clearTimers() {
    if (this.warningTimer) clearTimeout(this.warningTimer);
    if (this.logoutTimer) clearTimeout(this.logoutTimer);
  }

  private getTokenExpiration(token: string): number | null {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(
        payload.replace(/-/g, '+').replace(/_/g, '/'),
      );
      const parsed = JSON.parse(decoded);
      return parsed.exp ? parsed.exp * 1000 : null;
    } catch {
      return null;
    }
  }
}