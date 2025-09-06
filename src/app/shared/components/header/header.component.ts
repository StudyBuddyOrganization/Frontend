import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isMenuOpen = false;
  isProfileOpen = false;
  user = {
    name: 'Mr.Ansari',
    email: 'john.doe@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
  };

  constructor(public router: Router) {}

  ngOnInit(): void {}

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleProfile(): void {
    this.isProfileOpen = !this.isProfileOpen;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
    this.isMenuOpen = false;
  }

  logout(): void {
    // Implement logout logic
    console.log('Logout clicked');
    this.router.navigate(['/auth/login']);
  }

  closeDropdowns(): void {
    this.isMenuOpen = false;
    this.isProfileOpen = false;
  }

  get currentUrl() {
    return this.router.url;
  }
}
