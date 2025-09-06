import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private router: Router) {
    this.checkStoredAuth();
  }

  login(email: string, password: string): Observable<boolean> {
    return new Observable(observer => {
      setTimeout(() => {
        if (email && password) {
          const user: User = {
            id: 1,
            name: 'Mr.Ansari',
            email: email,
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
          };
          
          localStorage.setItem('authToken', 'mock-jwt-token');
          localStorage.setItem('user', JSON.stringify(user));
          
          this.currentUserSubject.next(user);
          observer.next(true);
        } else {
          observer.next(false);
        }
        observer.complete();
      }, 1000);
    });
  }

  register(userData: any): Observable<boolean> {
    return new Observable(observer => {
      setTimeout(() => {
        const user: User = {
          id: Date.now(),
          name: userData.fullName,
          email: userData.email,
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
        };
        
        localStorage.setItem('authToken', 'mock-jwt-token');
        localStorage.setItem('user', JSON.stringify(user));
        
        this.currentUserSubject.next(user);
        observer.next(true);
        observer.complete();
      }, 1000);
    });
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    return !!(token && user);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private checkStoredAuth(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }
}
