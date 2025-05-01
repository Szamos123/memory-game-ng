import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _isLoggedIn = signal<boolean>(this.readFromLocalStorage());

  isLoggedIn = computed(() => this._isLoggedIn());

  login(email: string) {
    this._isLoggedIn.set(true);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', email);
    
  }

  logout() {
    this._isLoggedIn.set(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');

  }

  private readFromLocalStorage(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }
}
