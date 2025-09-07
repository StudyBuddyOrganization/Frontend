import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isMenuOpen = false;
  isProfileOpen = false;
  user: User | null = null;

  constructor(
    public router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user: User | null) => {
      this.user = user;
    });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleProfile(): void {
    this.isProfileOpen = !this.isProfileOpen;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
    this.isMenuOpen = false;
    this.isProfileOpen = false;
  }

  logout(): void {
    this.authService.logout();
  }

  closeDropdowns(): void {
    this.isMenuOpen = false;
    this.isProfileOpen = false;
  }

  get currentUrl() {
    return this.router.url;
  }
}
